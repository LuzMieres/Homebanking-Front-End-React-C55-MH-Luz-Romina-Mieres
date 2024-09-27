// src/redux/actions/requestNewCardAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

// Acción para solicitar una nueva tarjeta
export const requestNewCardAction = createAsyncThunk(
  "cards/requestNewCard",
  async ({ type, color }, { rejectWithValue, getState }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token available");
    }

    const { client } = getState().client; // Acceder correctamente al estado del cliente

    // Verificar si ya tiene una tarjeta del mismo tipo y color
    const existingCard = client.cards.find(card => card.type === type && card.color === color);
    if (existingCard) {
      return rejectWithValue(`You already have a ${type} card with ${color} color.`);
    }

    // Confirmación de solicitud
    const result = await Swal.fire({
      title: 'Confirm Request',
      text: `You are about to request a ${type} card with ${color} color.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) {
      return rejectWithValue("Request cancelled by user.");
    }

    // Determinar la URL base de la API según el entorno
    const baseURL =
      import.meta.env.VITE_APP_ENV === "production"
        ? import.meta.env.VITE_APP_API_URL_PRODUCTION
        : import.meta.env.VITE_APP_API_URL_DEVELOPMENT;

    console.log("Base URL:", baseURL);

    try {
      // Enviar solicitud de nueva tarjeta
      const response = await axios.post(`${baseURL}/cards/clients/current/cards`, 
      { 
        type, 
        color 
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Devuelve los datos de la nueva tarjeta creada
      return response.data; 
    } catch (error) {
      console.error("Error al solicitar la nueva tarjeta:", error);
      return rejectWithValue(
        error.response ? error.response.data : "There was a problem with the request."
      );
    }
  }
);
