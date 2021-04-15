import { createSlice } from '@reduxjs/toolkit';

export const challengeSlice = createSlice({
  name: 'data',
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
});

export const { getChallengePending, getChallengeSuccess, getChallengeFail } = challengeSlice.actions;

export default challengeSlice.reducer;
