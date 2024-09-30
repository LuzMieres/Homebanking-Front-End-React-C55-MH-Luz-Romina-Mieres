import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Acción para cargar todos los datos del cliente logueado
export const loadCurrentUserAction = createAsyncThunk(
  "client/loadCurrentUser",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in local storage.");
      return rejectWithValue("No token available");
    }

    try {
      // Realizar una única solicitud para obtener toda la información relevante
      const response = await axios.get("https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/auth/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data; // Devuelve todos los datos del cliente logueado
    } catch (error) {
      console.error("Error al obtener los datos del cliente logueado:", error);
      return rejectWithValue(
        error.response ? error.response.data : "Unknown error"
      );
    }
  }
);
