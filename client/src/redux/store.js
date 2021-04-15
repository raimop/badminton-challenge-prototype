import { configureStore } from '@reduxjs/toolkit';
import userReducer from './authSlice';
import rankingSlice from './rankingSlice';
import challengeReducer from "./challengeSlice";

export default configureStore({
  reducer: {
    auth: userReducer,
    ranking: rankingSlice,
    challenge: challengeReducer
  },
});
