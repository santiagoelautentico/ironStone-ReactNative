import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  apiKey: "",
  username: "",
};

export const loginSlice = createSlice({
  name: "login",  // Cambié "username" a "login" para ser más representativo
  initialState,
  reducers: {
    setApiKey: (state, action) => {
      state.apiKey = action.payload;
    },
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    cleanUsername: (state) => {
      state.username = "";
    },
    cleanApiKey: (state) => {
      state.apiKey = "";
    },
  },
});

export const { setApiKey, setUsername, setUserId, cleanUsername, cleanApiKey } = loginSlice.actions;
export default loginSlice.reducer;
