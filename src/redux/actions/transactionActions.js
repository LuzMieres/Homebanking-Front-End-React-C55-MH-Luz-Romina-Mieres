// transactionActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

// Acción para realizar una nueva transacción
export const createTransactionAction = createAsyncThunk(
    "transactions/createTransaction",
    async ({ sourceAccount, destinationAccount, amount, description, accountType }, { rejectWithValue }) => {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token available");
      }
  
      try {
        const result = await Swal.fire({
          title: 'Confirm Transaction',
          text: `You are about to transfer $${amount} from account: ${sourceAccount} to ${destinationAccount}.\n\nDescription: ${description}`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel'
        });
  
        if (!result.isConfirmed) {
          return rejectWithValue("Transaction cancelled by user.");
        }
  
        // Realizar la transacción
        const response = await axios.post("https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/transactions/", {
          sourceAccount,
          destinationAccount,
          amount,
          description,
          accountType
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // const response = await axios.post("https://localhost:8080/api/transactions/", {
        //   sourceAccount,
        //   destinationAccount,
        //   amount,
        //   description,
        //   accountType
        // }, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
        
        return response.data; // Devuelve los datos de la transacción creada
      } catch (error) {
        console.error("Error en la solicitud de transacción:", error.response?.data || error.message);
        return rejectWithValue(
          error.response?.data || "There was a problem with the request."
        );
      }
    }
  );
  