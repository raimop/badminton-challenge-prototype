import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as services from "../actions/services";

export const updateChallenges = createAsyncThunk(
  'challenges/fetch',
  async () => {
    const res = await services.fetchChallenges()
    return {
      unconfirmed: res.filter(e => !(e.challenger.resultAccepted && e.challenged.resultAccepted)),
      rest: res.filter(e => (e.challenger.resultAccepted && e.challenged.resultAccepted))
    }
  }
)

export const challengeSlice = createSlice({
  name: 'challenges',
  initialState: {
    data: { unconfirmed: [], rest: [] },
    isLoading: false,
    error: ""
  },
  reducers: {
    getChallengePending: state => {
      state.isLoading = true;
    },
    getChallengeSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload;
      state.error = "";
    },
    getChallengeFail: (state, { payload }) => {
      state.isLoading = false;
      state.error = payload;
    },
  },
  extraReducers: {
    [updateChallenges.pending]: (state, action) => {
      state.isLoading = true
    },
    [updateChallenges.fulfilled]: (state, action) => {
      state.isLoading = false
      state.data = action.payload
    },
    [updateChallenges.rejected]: (state, action) => {
      state.error = action.error
    }
  }
});

export const { getChallengePending, getChallengeSuccess, getChallengeFail } = challengeSlice.actions;

export default challengeSlice.reducer;
