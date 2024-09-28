import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { loadCurrentUserAction } from './loadCurrentUserAction'; // Asegúrate de que este path es correcto

// Acción para solicitar un nuevo préstamo
export const requestNewLoanAction = createAsyncThunk(
  "loans/requestNewLoan",
  async ({ loanName, amount, payments, destinationAccountNumber }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available in localStorage");
      return rejectWithValue("No token available");
    }

    try {
      console.log("Sending loan request to backend with data:", {
        loanName,
        amount,
        payments,
        destinationAccountNumber
      });

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

      console.log("Loan request successful:", response.data);

      // Si la solicitud de préstamo es exitosa, recargamos la información del cliente
      await dispatch(loadCurrentUserAction());
      return response.data; // Devuelve los datos del préstamo creado

    } catch (error) {
      console.error("Error en la solicitud de préstamo:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || "There was a problem with the request."
      );
    }
  }
);
