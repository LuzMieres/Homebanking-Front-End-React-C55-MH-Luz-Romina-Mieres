import { createAsyncThunk, createAction } from "@reduxjs/toolkit";
import axios from "axios";

// Acción para login
export const loginAction = createAction("loginAction", (data) => {
  const usuario = {
    client: data,
    log: true,
  };
  return {
    payload: usuario,
  };
});

// Acción para obtener datos del cliente usando createAsyncThunk
export const fetchClientData = createAsyncThunk("fetchClientData", async () => {
  const token = localStorage.getItem("token");
    
  const response = await axios.get("http://localhost:8080/api/auth/current", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    console.log(response.data);
    return loginAction(response.data);
  }).catch((error) => {
    console.error("Error fetching client data:", error);
  });

  
});

