// loanActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Acción para cargar los préstamos disponibles
export const loadAvailableLoans = createAsyncThunk(
  "loans/loadAvailableLoans",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token available");
    }

    try {
      const response = await axios.get(`$https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/loans/loansAvailable`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data; // Devuelve los préstamos disponibles
    } catch (error) {
      console.error("Error al cargar los préstamos disponibles:", error);
      return rejectWithValue(
        error.response ? error.response.data : "Unknown error"
      );
    }
  }
);

// Acción para solicitar un nuevo préstamo
export const requestNewLoanAction = createAsyncThunk(
  "loans/requestNewLoan",
  async ({ loanName, amount, payments, destinationAccountNumber }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token available");
    }

    try {
      const response = await axios.post(
        `https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/loans/apply`,
        {
          loanName,
          amount,
          payments,
          destinationAccountNumber
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return response.data; // Devuelve los datos del préstamo creado
    } catch (error) {
      console.error("Error en la solicitud de préstamo:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "There was a problem with the request."
      );
    }
  }
);