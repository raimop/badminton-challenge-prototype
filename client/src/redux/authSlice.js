import { createSlice } from '@reduxjs/toolkit';

const initialUser = JSON.parse(localStorage.getItem("user")) || null;
const initialToken = localStorage.getItem("token") || null;

export const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: initialToken,
    isLoading: false,
    error: ""
  },
  reducers: {
    getUserPending: state => {
      state.isLoading = true;
    },
    getUserSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.user = payload.user;
      state.token = payload.token;
      state.error = "";
    },
    updateUserSuccess: (state, { payload }) => {
      state.user = payload;
    },
    getUserFail: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
    resetUserSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.error = "";
    }
  },
});

export const { getUserPending, getUserSuccess, updateUserSuccess, getUserFail, resetUserSuccess } = userSlice.actions;

export default userSlice.reducer;
