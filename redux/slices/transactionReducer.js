import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
  },
});
export const { setTransactions, addTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
