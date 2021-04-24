import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as services from "../actions/services";

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const res = await services.fetchNotifications()
    return res
  }
)

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    data: [],
    isLoading: false,
    error: ""
  },
  reducers: {
    getNotificationPending: state => {
      state.isLoading = true;
    },
    getNotificationSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload
      state.error = "";
    },
    getNotificationFail: (state, payload) => {
      state.isLoading = false;
      state.error = payload;
    },
  },
});

export const { getNotificationPending, getNotificationSuccess, getNotificationFail } = notificationSlice.actions;

export default notificationSlice.reducer;
