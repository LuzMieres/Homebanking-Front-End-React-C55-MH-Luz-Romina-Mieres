import axios from "axios";
import React from "react";

const AddAccount = () => {
  axios
    .post(
      "http://localhost:8080/api/clients/create?email=ludwingval@gmail.com&firstName=Valecillos&lastName=garcia"
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
