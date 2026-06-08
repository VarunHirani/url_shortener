import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isAuthLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAuthLoading = false;
    },
    finishAuthLoading: (state) => {
      state.isAuthLoading = false;
    },
  },
});

export const { login,logout,finishAuthLoading } = authSlice.actions;
export default authSlice.reducer;
