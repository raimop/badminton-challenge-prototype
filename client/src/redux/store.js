import { configureStore } from '@reduxjs/toolkit';
import userReducer from './authSlice';
import rankingSlice from './rankingSlice';
import notificationReducer from "./notificationSlice";
import challengeReducer from "./challengeSlice";

export default configureStore({
  reducer: {
    auth: userReducer,
    ranking: rankingSlice,
    notifications: notificationReducer,
    challenge: challengeReducer
  },
});
