import { configureStore } from "@reduxjs/toolkit";
import loadCurrentUserReducer from "./reducers/loadCurrentUserReducer";
import loanReducer from "./reducers/loanReducer"; // Importa el nuevo reducer
import { accountReducer } from "./reducers/newAccountReducer";

const store = configureStore({
  reducer: {
    currentUser: loadCurrentUserReducer,
    loans: loanReducer, // Registra el nuevo reducer aquí
    accountReducer: accountReducer,
  },
});

export default store;
