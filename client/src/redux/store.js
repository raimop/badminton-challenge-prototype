import { configureStore } from '@reduxjs/toolkit';
import userReducer from './authSlice';
import rankingSlice from './rankingSlice';

export default configureStore({
  reducer: {
    auth: userReducer,
    ranking: rankingSlice
  },
});
