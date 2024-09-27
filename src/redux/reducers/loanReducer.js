import { createReducer } from "@reduxjs/toolkit";
import { requestNewLoanAction,  loadAvailableLoans } from '../actions/loanActions';
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
      state.loans.push(action.payload); // Agrega el nuevo préstamo a la lista de préstamos
      state.status = "succeeded";
    })
    .addCase(requestNewLoanAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload; // Maneja los errores
    })
    .addCase( loadAvailableLoans.pending, (state) => {
      state.status = "loading";
    })
    .addCase( loadAvailableLoans.fulfilled, (state, action) => {
      state.loans = action.payload; // Actualiza la lista de préstamos del cliente
      state.status = "succeeded";
    })
    .addCase( loadAvailableLoans.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(loadCurrentUserAction.fulfilled, (state, action) => {
      state.loans = action.payload.loans || []; // Asegúrate de que sea un array
    });
    
});

export default loanReducer;
