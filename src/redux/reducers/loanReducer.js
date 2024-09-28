import { createReducer } from "@reduxjs/toolkit";
import { requestNewLoanAction } from '../actions/loanActions';
import { loadCurrentUserAction } from '../actions/loadCurrentUserAction';

const initialState = {
  loans: [], // Lista de préstamos del cliente
  status: "idle",
  error: null,
};

const loanReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(requestNewLoanAction.pending, (state) => {
      state.status = "loading";
    })
    .addCase(requestNewLoanAction.fulfilled, (state, action) => {
      // No necesitamos hacer push porque los loans se actualizan con loadCurrentUserAction
      state.status = "succeeded";
    })
    .addCase(requestNewLoanAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload; // Maneja los errores
    })
    .addCase(loadCurrentUserAction.fulfilled, (state, action) => {
      state.loans = action.payload.loans || []; // Asegúrate de que sea un array
    });
});

export default loanReducer;
