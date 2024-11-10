import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";
import coinsReducer from "./slices/coinsReducer";
import transactionsReducer from "./slices/transactionReducer";
export const store = configureStore({
  reducer: {
    login: loginReducer,
    coins: coinsReducer,
    transactions: transactionsReducer,
  },
});

export default store;
