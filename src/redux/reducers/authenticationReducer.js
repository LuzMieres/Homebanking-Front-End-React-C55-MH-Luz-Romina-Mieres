import { createReducer } from "@reduxjs/toolkit";
import { loginAction, fetchClientData } from "../actions/authenticationAction";

const initialState = {
  client: null,
  log: false,
};

export const authenticationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginAction, (state, action) => {
      console.log(action.payload);
      return {
        ...state,
        client: action.payload.client,
        log: action.payload.log,
      };
    })
    .addCase(fetchClientData.fulfilled, (state, action) => {
      console.log(action.payload);
      return {
        ...state,
        client: action.payload.client,
        log: action.payload.log,
      };
    })
    .addCase(fetchClientData.pending, (state) => {
      console.log("Fetching client data...");
    })
    .addCase(fetchClientData.rejected, (state, action) => {
      console.error("Failed to fetch client data:", action.error.message);
    });
});
