import { createReducer } from "@reduxjs/toolkit";
import { loadCurrentUserAction } from '../actions/loadCurrentUserAction';
import { createTransactionAction } from '../actions/transactionActions';
import { requestNewCardAction } from '../actions/cardActions'; // Importar la acción de solicitud de tarjeta

const initialState = {
  client: null,
  status: "idle",
  error: null,
};

const loadCurrentUserReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadCurrentUserAction.fulfilled, (state, action) => {
      console.log("Datos del cliente logueado recibidos:", action.payload);
      state.client = action.payload;
      state.status = "success";
    })
    .addCase(loadCurrentUserAction.pending, (state) => {
      state.status = "loading";
    })
    .addCase(loadCurrentUserAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(createTransactionAction.fulfilled, (state, action) => {
      console.log("Nueva transacción creada:", action.payload);
      if (state.client) {
        const account = state.client.accounts.find(acc => acc.number === action.payload.originAccountNumber);
        if (account) {
          account.transactions.push(action.payload);
          account.balance -= action.payload.amount;
        }
      }
    })
    .addCase(requestNewCardAction.fulfilled, (state, action) => {
      console.log("Nueva tarjeta creada:", action.payload);
      if (state.client) {
        state.client.cards.push(action.payload); // Agregar la nueva tarjeta a la lista de tarjetas del cliente
      }
    });
});

export default loadCurrentUserReducer;
