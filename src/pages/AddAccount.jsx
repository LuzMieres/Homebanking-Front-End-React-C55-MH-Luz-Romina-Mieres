import axios from "axios";
import React, { useEffect } from "react";

const AddAccount = () => {
  // Determinar la URL base de la API según el entorno
  const baseURL =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_API_URL_PRODUCTION
      : process.env.REACT_APP_API_URL_DEVELOPMENT;

  useEffect(() => {
    // Llamada a la API para crear una cuenta
    axios
      .post(
        `${baseURL}/clients/create?email=luzmieres@gmail.com&firstName=Luz&lastName=Mieres`
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [baseURL]);

  return (
    <div>
      <h1>Create Account</h1>
    </div>
  );
};

export default AddAccount;
