import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export const startCameraStream = createAsyncThunk(
  'monitoring/startCameraStream',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.startCamera(deviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const stopCameraStream = createAsyncThunk(
  'monitoring/stopCameraStream',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.stopCamera();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const startScreenStream = createAsyncThunk(
  'monitoring/startScreenStream',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.startScreen(deviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const stopScreenStream = createAsyncThunk(
  'monitoring/stopScreenStream',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.stopScreen();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchGallery = createAsyncThunk(
  'monitoring/fetchGallery',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.getGallery(deviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSmsHistory = createAsyncThunk(
  'monitoring/fetchSmsHistory',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.getSmsHistory(deviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteSms = createAsyncThunk(
  'monitoring/deleteSms',
  async (smsId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.deleteSms(smsId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const exportSms = createAsyncThunk(
  'monitoring/exportSms',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.exportSms(deviceId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const downloadFile = createAsyncThunk(
  'monitoring/downloadFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.downloadFile(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'monitoring/deleteFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await api.monitoring.deleteFile(fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const monitoringSlice = createSlice({
  name: 'monitoring',
  initialState: {
    cameraStream: null,
    screenStream: null,
    isStreaming: false,
    gallery: [],
    smsHistory: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGallery: (state) => {
      state.gallery = [];
    },
    clearSmsHistory: (state) => {
      state.smsHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Camera Stream
      .addCase(startCameraStream.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startCameraStream.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cameraStream = action.payload.stream;
        state.isStreaming = true;
      })
      .addCase(startCameraStream.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error('Gagal memulai streaming kamera');
      })
      .addCase(stopCameraStream.fulfilled, (state) => {
        state.cameraStream = null;
        state.isStreaming = false;
      })
      // Screen Stream
      .addCase(startScreenStream.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startScreenStream.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screenStream = action.payload.stream;
        state.isStreaming = true;
      })
      .addCase(startScreenStream.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error('Gagal memulai streaming layar');
      })
      .addCase(stopScreenStream.fulfilled, (state) => {
        state.screenStream = null;
        state.isStreaming = false;
      })
      // Gallery
      .addCase(fetchGallery.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.gallery = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error('Gagal mengambil gallery');
      })
      // SMS History
      .addCase(fetchSmsHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSmsHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.smsHistory = action.payload;
      })
      .addCase(fetchSmsHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error('Gagal mengambil riwayat SMS');
      });
  },
});

export const { clearError, clearGallery, clearSmsHistory } = monitoringSlice.actions;
export default monitoringSlice.reducer;
