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
    markAllNotificationsRead: state => {
      state.data = state.data.map(e => { return { ...e, read: 1 }})
    },
    removeChallengeFromNotification: (state, { payload }) => {
      const id = state.data.findIndex(e => e._id === payload.id);
      state.data[id].challenge = null
    },
    removeAllNotifications: state => {
      state.data = []
    },
    removeNotification: (state, { payload }) => {
      state.data = state.data.filter(e => e._id !== payload.id)
    },
    toggleNotification: (state, { payload }) => {
      const id = state.data.findIndex(e => e._id === payload.id);
      state.data[id].read = state.data[id].read ? 0 : 1
    },
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
  extraReducers: {
    [fetchNotifications.pending]: (state, action) => {
      state.isLoading = true
    },
    [fetchNotifications.fulfilled]: (state, action) => {
      state.isLoading = false
      state.data = action.payload
    },
    [fetchNotifications.rejected]: (state, action) => {
      state.error = action.error
    }
  }
});

export const { getNotificationPending, getNotificationSuccess, getNotificationFail, removeNotification, removeAllNotifications, toggleNotification, removeChallengeFromNotification, addNotification, markAllNotificationsRead } = notificationSlice.actions;

export default notificationSlice.reducer;
