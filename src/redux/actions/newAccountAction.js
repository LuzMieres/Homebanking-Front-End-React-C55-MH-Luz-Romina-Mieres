// src/redux/actions/newAccountAction.js
import axios from "axios";
import { loadCurrentUserAction } from "./loadCurrentUserAction";

// Acción para crear una nueva cuenta
export const newAccountAction = (accountType) => async (dispatch) => {
  try {
    await axios.post(
      "https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/accounts/clients/current/accounts",
      { type: accountType },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // await axios.post(
    //   "https://localhost:8080/api/accounts/clients/current/accounts",
    //   { type: accountType },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //     },
    //   }
    // );
    dispatch(loadCurrentUserAction());
  } catch (error) {
    console.error(
      "Error creating account:",
      error.response ? error.response.data : error.message
    );
  }
};