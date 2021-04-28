import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as services from "../actions/services";

export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async () => {
    const res = await services.fetchNotifications()
    return res
  }
)

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id) => {
    const res = await services.deleteNotification(id)
    return res
  }
)

export const deleteAllNotification = createAsyncThunk(
  'notifications/deleteAll',
  async () => {
    const res = await services.deleteAllNotification()
    return res
  }
)

export const toggleNotificationRead = createAsyncThunk(
  'notifications/toggleRead',
  async (id) => {
    const res = await services.updateNotification(id)
    return res
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async () => {
    const res = await services.markAllNotificationsRead()
    return res
  }
)

export const removeChallengeFromNotification = createAsyncThunk(
  'notifications/removeChallenge',
  async (id) => {
    const res = await services.deleteChallenge(id)
    return res
  }
)

export const acceptChallengeFromNotification = createAsyncThunk(
  'notifications/acceptChallenge',
  async (id) => {
    const res = await services.acceptChallenge(id)
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
    },
    [deleteNotification.fulfilled]: (state, { payload }) => {
      state.data = state.data.filter(e => e._id !== payload._id)
    },
    [deleteAllNotification.fulfilled]: (state) => {
      state.data = []
    },
    [toggleNotificationRead.fulfilled]: (state, { payload }) => {
      const id = state.data.findIndex(e => e._id === payload._id);
      state.data[id].read = state.data[id].read ? 0 : 1
    },
    [markAllNotificationsRead.fulfilled]: (state) => {
      state.data = state.data.map(e => { return { ...e, read: 1 }})
    },
    [removeChallengeFromNotification.fulfilled]: (state, { payload }) => {
      const id = state.data.findIndex(e => e.challenge && e.challenge._id === payload._id);
      state.data[id].challenge = null
    },
    [acceptChallengeFromNotification.fulfilled]: (state, { payload }) => {
      const id = state.data.findIndex(e => e.challenge && e.challenge._id === payload._id);
      state.data[id].challenge = null
    },
  }
});

export const { getNotificationPending, getNotificationSuccess, getNotificationFail, removeNotification, removeAllNotifications, toggleNotification, addNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
