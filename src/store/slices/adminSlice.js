import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api';

// Fetch Users
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Create User
export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin/users', userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create user');
    }
  }
);

// Update User
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/users/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// Delete User
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/admin/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Suspend User
export const suspendUser = createAsyncThunk(
  'admin/suspendUser',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.post(`/admin/users/${id}/suspend`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to suspend user');
    }
  }
);

// Activate User
export const activateUser = createAsyncThunk(
  'admin/activateUser',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.post(`/admin/users/${id}/activate`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate user');
    }
  }
);

// Fetch Roles
export const fetchRoles = createAsyncThunk(
  'admin/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/roles');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

// Update Role
export const updateRole = createAsyncThunk(
  'admin/updateRole',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/roles/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role');
    }
  }
);

// Fetch Licenses
export const fetchLicenses = createAsyncThunk(
  'admin/fetchLicenses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/licenses');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch licenses');
    }
  }
);

// Create License
export const createLicense = createAsyncThunk(
  'admin/createLicense',
  async (licenseData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/admin/licenses', licenseData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create license');
    }
  }
);

// Update License
export const updateLicense = createAsyncThunk(
  'admin/updateLicense',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/admin/licenses/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update license');
    }
  }
);

// Fetch Settings
export const fetchSettings = createAsyncThunk(
  'admin/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/admin/settings');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
    }
  }
);

// Update Settings
export const updateSettings = createAsyncThunk(
  'admin/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await apiClient.put('/admin/settings', settingsData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    roles: [],
    licenses: [],
    systemSettings: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u._id !== action.payload);
      })
      // Roles
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(r => r._id === action.payload._id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      // Licenses
      .addCase(fetchLicenses.fulfilled, (state, action) => {
        state.licenses = action.payload;
      })
      .addCase(createLicense.fulfilled, (state, action) => {
        state.licenses.push(action.payload);
      })
      .addCase(updateLicense.fulfilled, (state, action) => {
        const index = state.licenses.findIndex(l => l._id === action.payload._id);
        if (index !== -1) {
          state.licenses[index] = action.payload;
        }
      })
      // Settings
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.systemSettings = action.payload;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.systemSettings = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
