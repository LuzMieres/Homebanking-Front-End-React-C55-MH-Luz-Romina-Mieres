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

    const { client } = getState().currentUser; // Obtener el cliente actual del estado global

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

    try {
      const response = await axios.post("https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/cards/clients/current/cards", {
        type: type,
        color: color,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    // try {
    //   const response = await axios.post("https://localhost:8080/api/cards/clients/current/cards", {
    //     type: type,
    //     color: color,
    //   }, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   });
      return response.data; // Devuelve los datos de la nueva tarjeta creada
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "There was a problem with the request."
      );
    }
  }
);