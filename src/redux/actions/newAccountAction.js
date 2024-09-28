// src/redux/actions/newAccountAction.js
import axios from "axios";
import { loadCurrentUserAction } from "./loadCurrentUserAction";

// Acción para crear una nueva cuenta
export const newAccountAction = (accountType) => async (dispatch) => {
  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated. No token available.");
    }

    // Realizar la solicitud para crear una nueva cuenta
    const response = await axios.post(
      `$https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/accounts/clients/current/accounts`, // URL corregida con backticks
      {
        type: accountType // Datos a enviar en el cuerpo de la solicitud
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Account created:", response.data);

    // Cargar los datos actualizados del usuario
    dispatch(loadCurrentUserAction());
  } catch (error) {
    // Manejar el error en caso de que ocurra
    console.error(
      "Error creating account:",
      error.response ? error.response.data : error.message
    );
  }
};
