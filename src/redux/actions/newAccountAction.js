// src/redux/actions/newAccountAction.js
import axios from "axios";
import { loadCurrentUserAction } from "./loadCurrentUserAction";

// Acción para crear una nueva cuenta
export const newAccountAction = (accountType) => async (dispatch) => {
  // Determinar la URL base de la API según el entorno
  const baseURL =
    import.meta.env.VITE_APP_ENV === "production"
      ? import.meta.env.VITE_APP_API_URL_PRODUCTION
      : import.meta.env.VITE_APP_API_URL_DEVELOPMENT;

  console.log("Base URL:", baseURL);

  try {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User is not authenticated. No token available.");
    }

    // Realizar la solicitud para crear una nueva cuenta
    const response = await axios.post(
      `${baseURL}/clients/current/accounts`, // URL corregida con backticks
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
