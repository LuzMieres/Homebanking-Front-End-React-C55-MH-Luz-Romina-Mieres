// clientAction.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Acción para cargar todos los datos del cliente logueado
export const loadCurrentUserAction = createAsyncThunk(
  "client/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return rejectWithValue("No token available");
    }

    // Determinar la URL base de la API según el entorno
    const baseURL =
      import.meta.env.VITE_APP_ENV === "production"
        ? import.meta.env.VITE_APP_API_URL_PRODUCTION
        : import.meta.env.VITE_APP_API_URL_DEVELOPMENT;

    console.log("Base URL:", baseURL);
    try {
      const response = await axios.get(`${baseURL}/auth/current`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener los datos del cliente logueado:", error.response?.data || error.message);
      return rejectWithValue(
        error.response ? error.response.data : "Unknown error"
      );
    }
    
  }
);
