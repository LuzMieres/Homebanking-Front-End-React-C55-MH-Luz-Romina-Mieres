import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { newAccountAction } from "../redux/actions/newAccountAction";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content'; // Importa la integración con React

const MySwal = withReactContent(Swal); // Crear una instancia de SweetAlert con soporte para React

function NewAccountData() {
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
    <div className="new-account-data-container">
      <div className="new-account-data-form">
        <img
          className="new-account-data-image"
          src="newTransaction.png"
          alt="newTransaction"
        />
        <form onSubmit={handleSubmit} className="new-account-data-form-content">
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <h3 className="form-title">Select the type of account you wish to apply for</h3>
            <label className="form-label">Account Type</label>
            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="form-select"
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
            className="submit-button"
          >
            Request Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewAccountData;
