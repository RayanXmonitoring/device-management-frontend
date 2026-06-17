import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  },
  admin: {
    users: [],
    roles: [],
    licenses: [],
    isLoading: false,
    error: null,
  },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'auth/login/pending':
      return { ...state, auth: { ...state.auth, isLoading: true, error: null } };
    case 'auth/login/fulfilled':
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
        },
      };
    case 'auth/login/rejected':
      return { ...state, auth: { ...state.auth, isLoading: false, error: action.payload } };
    case 'auth/logout':
      return { ...state, auth: { ...initialState.auth } };
    case 'admin/fetchUsers/fulfilled':
      return { ...state, admin: { ...state.admin, users: action.payload } };
    case 'admin/fetchRoles/fulfilled':
      return { ...state, admin: { ...state.admin, roles: action.payload } };
    case 'admin/fetchLicenses/fulfilled':
      return { ...state, admin: { ...state.admin, licenses: action.payload } };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});
