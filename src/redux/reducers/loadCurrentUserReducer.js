import { createReducer } from "@reduxjs/toolkit";
import { loadCurrentUserAction } from '../actions/loadCurrentUserAction';
import { createTransactionAction } from '../actions/transactionActions';
import { requestNewCardAction } from '../actions/cardActions';

const initialState = {
  client: null, // Asegúrate de inicializar correctamente el estado
  status: "idle",
  error: null,
};

const loadCurrentUserReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadCurrentUserAction.fulfilled, (state, action) => {
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
      if (state.client) {
        const account = state.client.accounts.find(acc => acc.number === action.payload.originAccountNumber);
        if (account) {
          account.transactions.push(action.payload);
          account.balance -= action.payload.amount;
        }
      }
    })
    .addCase(requestNewCardAction.fulfilled, (state, action) => {
      if (state.client) {
        state.client.cards.push(action.payload); // Agregar la nueva tarjeta a la lista de tarjetas del cliente
      }
    });
});

export default loadCurrentUserReducer;
