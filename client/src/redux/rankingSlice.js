import { createSlice } from '@reduxjs/toolkit';

export const rankingSlice = createSlice({
  name: 'data',
  initialState: {
    data: { ms: [], ws: [] },
    isLoading: false,
    error: ""
  },
  reducers: {
    getRankingPending: state => {
      state.isLoading = true;
    },
    getRankingSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload;
      state.error = "";
    },
    getRankingFail: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
  },
});

export const { getRankingPending, getRankingSuccess, getRankingFail } = rankingSlice.actions;

export default rankingSlice.reducer;
