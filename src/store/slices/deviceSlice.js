import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

export const fetchDevices = createAsyncThunk(
  'devices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.devices.getAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const registerDevice = createAsyncThunk(
  'devices/register',
  async (deviceData, { rejectWithValue }) => {
    try {
      const response = await api.devices.register(deviceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const lockDevice = createAsyncThunk(
  'devices/lock',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await api.devices.lock(deviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const setLostMode = createAsyncThunk(
  'devices/setLostMode',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await api.devices.setLostMode(deviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const deviceSlice = createSlice({
  name: 'devices',
  initialState: {
    devices: [],
    selectedDevice: null,
    isLoading: false,
    error: null,
    stats: {
      online: 0,
      offline: 0,
      lost: 0,
      total: 0,
    },
  },
  reducers: {
    selectDevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
    updateDeviceStatus: (state, action) => {
      const { deviceId, status } = action.payload;
      const device = state.devices.find(d => d.id === deviceId);
      if (device) {
        device.status = status;
        device.lastUpdated = new Date().toISOString();
        // Update stats
        state.stats = calculateStats(state.devices);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDevices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDevices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.devices = action.payload;
        state.stats = calculateStats(action.payload);
      })
      .addCase(fetchDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(registerDevice.fulfilled, (state, action) => {
        state.devices.push(action.payload);
        state.stats = calculateStats(state.devices);
      })
      .addCase(lockDevice.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
          state.stats = calculateStats(state.devices);
        }
      })
      .addCase(setLostMode.fulfilled, (state, action) => {
        const index = state.devices.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.devices[index] = action.payload;
          state.stats = calculateStats(state.devices);
        }
      });
  },
});

const calculateStats = (devices) => {
  return {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    lost: devices.filter(d => d.status === 'lost').length,
  };
};

export const { selectDevice, updateDeviceStatus, clearError } = deviceSlice.actions;
export default deviceSlice.reducer;
