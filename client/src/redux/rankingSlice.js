import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as services from "../actions/services";

export const updateRankings = createAsyncThunk(
  'ranking/fetch',
  async () => {
    const res = await services.fetchRankings()
    return res
  }
)

export const rankingSlice = createSlice({
  name: 'ranking',
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
  extraReducers: {
    [updateRankings.pending]: (state, action) => {
      state.isLoading = true
    },
    [updateRankings.fulfilled]: (state, action) => {
      state.isLoading = false
      state.data = action.payload
    },
    [updateRankings.rejected]: (state, action) => {
      state.error = action.error
    }
  }
});

export const { getRankingPending, getRankingSuccess, getRankingFail } = rankingSlice.actions;

export default rankingSlice.reducer;
