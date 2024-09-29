import { createReducer } from "@reduxjs/toolkit";
import { requestNewLoanAction, loadClientLoans } from '../actions/loanActions';
import { loadCurrentUserAction } from '../actions/loadCurrentUserAction';

const initialState = {
  loans: [],
  status: "idle", // Asegúrate de que el estado inicial esté configurado correctamente
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
    .addCase(loadClientLoans.pending, (state) => {
      state.status = "loading";
    })
    .addCase(loadClientLoans.fulfilled, (state, action) => {
      console.log("Préstamos recibidos en el reducer:", action.payload); // Verifica el contenido de los préstamos recibidos
      state.loans = action.payload;
      state.status = "succeeded";
    })    
    .addCase(loadClientLoans.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(loadCurrentUserAction.fulfilled, (state, action) => {
      // Verifica que el cliente contenga préstamos
      state.loans = action.payload.loans || []; // Asegúrate de que sea un array
    });
});

export default loanReducer;