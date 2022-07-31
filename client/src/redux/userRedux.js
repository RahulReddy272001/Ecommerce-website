import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    initialState: {
      currentUser: null,
      isFatching: false,
      error: false
    }

  },

  reducers: {
    loginStart: (state) => {
      state.isFatching = true
    },
    loginSuccess: (state, action) => {
      state.isFatching = false;
      state.currentUser = action.payload
    },
    loginFailure: (state) => {
      state.isFatching = false;
      state.error = true
    },

  }
})
//yha pr reducer likhte h
export const { loginStart, loginSuccess, loginFailure } = userSlice.actions;
export default userSlice.reducer;