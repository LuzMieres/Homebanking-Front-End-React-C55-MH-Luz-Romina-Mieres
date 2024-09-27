import { createReducer } from "@reduxjs/toolkit";
import { addCardToClient, loadClient } from "../actions/clientAction"; // Asegúrate de importar correctamente

const initialState = {
  client: {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    accounts: [
      {
        id: 0,
        number: 0,
        balance: 0,
        creationDate: "",
        transactions: [
          {
            id: 0,
            type: "",
            amount: 0,
            description: "",
            date: "",
          },
        ],
      },
    ],
    loans: [
      {
        id: 0,
        loanId: 0,
        name: "",
        amount: 0,
        payments: 0,
      },
    ],
    cards: [
      {
        id: 0,
        cvv: 0,
        number: 0,
        fromDate: "",
        thruDate: "",
        type: "",
        color: "",
        clientHolder: "",
      },
    ],
  },
  status: "idle",
  error: null, // Agregado para manejar errores
};

const clientReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loadClient.fulfilled, (state, action) => {
      state.client = action.payload;
      state.status = "success";
    })
    .addCase(loadClient.pending, (state) => {
      state.status = "loading"; 
    })
    .addCase(loadClient.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    })
    .addCase(addCardToClient, (state, action) => {
      state.client.cards.push(action.payload);
    });
});

export default clientReducer;
