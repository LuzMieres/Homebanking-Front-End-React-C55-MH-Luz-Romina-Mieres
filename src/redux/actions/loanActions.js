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
      const baseURL =
        import.meta.env.VITE_APP_ENV === "production"
          ? import.meta.env.VITE_APP_API_URL_PRODUCTION
          : import.meta.env.VITE_APP_API_URL_DEVELOPMENT;

      const response = await axios.get(`${baseURL}/loans/loansAvailable`, {
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
      const baseURL =
        import.meta.env.VITE_APP_ENV === "production"
          ? import.meta.env.VITE_APP_API_URL_PRODUCTION
          : import.meta.env.VITE_APP_API_URL_DEVELOPMENT;

      const response = await axios.post(
        `${baseURL}/loans/apply`,
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