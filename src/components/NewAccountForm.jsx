import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { newAccountAction } from "../redux/actions/newAccountAction";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; // Importa la integración con React

const MySwal = withReactContent(Swal); // Crear una instancia de SweetAlert con soporte para React

function NewAccountForm() {
  const [accountType, setAccountType] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!accountType) {
      setError("Please select an account type.");
      return;
    }

    // Mostrar el SweetAlert con la confirmación de la solicitud
    MySwal.fire({
      title: "Confirm Account Request",
      text: `You are about to create a new ${accountType}. Do you want to proceed?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, create it!",
      cancelButtonText: "No, cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Si se confirma, se despacha la acción para crear la cuenta
        dispatch(newAccountAction(accountType))
          .then(() => {
            // Mostrar mensaje de éxito y redirigir a /accounts
            MySwal.fire("Success", "Account created successfully!", "success");
            navigate("/accounts");
          })
          .catch((err) => {
            // Mostrar mensaje de error si la creación de la cuenta falla
            MySwal.fire("Error", "Failed to create account. Please try again.", "error");
          });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-[90%] bg-white p-2 rounded-lg shadow-2xl gap-4">
        <img className="w-full md:w-1/2 h-auto object-cover mb-4 md:mb-0 lg:h-[60vh]" src="newTransaction.png" alt="newTransaction" />
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-around w-full md:w-1/2 gap-1 lg:h-[60vh] pt-1">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className=" flex flex-col justify-center items-center mb-4 w-full h-full">
          <h3 className="text-xl text-blue-800">Select the type of account you wish to apply for</h3>
          <label className="text-gray-700 text-xl">Account Type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-[80%] p-2 border border-gray-300 rounded mt-2 flex"
          >
            <option value="" disabled>
              Select an account type
            </option>
            <option value="Checking">Checking Account</option>
            <option value="Savings">Savings Account</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-[80%] p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Request Account
        </button>
      </form>
      </div>
    </div>
  );
}

export default NewAccountForm;
