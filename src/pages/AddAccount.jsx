import axios from "axios";
import React from "react";

const AddAccount = () => {
  axios
    .post(
      "https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/clients/create?email=luzmieres@gmail.com&firstName=Luz&lastName=Mieres"
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <div>
      <h1>Create Account</h1>
    </div>
  );
};

export default AddAccount;
