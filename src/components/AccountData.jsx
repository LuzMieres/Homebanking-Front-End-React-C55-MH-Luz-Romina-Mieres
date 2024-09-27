import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadCurrentUserAction } from "../redux/actions/loadCurrentUserAction";

function AccountDetails() {
  const { id } = useParams(); // Obtener el ID de la cuenta desde los parámetros de la URL
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(false); // Estado para mostrar/ocultar el balance

  const { client, status, error } = useSelector((state) => state.currentUser);
  const [account, setAccount] = useState(null); // Estado local para almacenar la cuenta seleccionada

  useEffect(() => {
    if (isNaN(id)) {
      console.error("The account ID from the URL is not a valid number:", id);
      return;
    }

    const accountId = parseInt(id, 10);

    // Si el cliente no está cargado y el estado es 'idle', cargar datos del cliente
    if (!client && status === "idle") {
      dispatch(loadCurrentUserAction());
    } else if (client && client.accounts) {
      // Buscar la cuenta seleccionada por ID
      const selectedAccount = client.accounts.find((acc) => acc.id === accountId);
      setAccount(selectedAccount);
    }
  }, [client, id, status, dispatch]);

  if (status === "loading") {
    return <div className="loading-message">Loading client data...</div>;
  }

  if (status === "failed") {
    return <div className="error-message">Error loading client data: {error}</div>;
  }

  if (!client) {
    return <div className="no-data-message">No client data available.</div>;
  }

  if (!account) {
    return (
      <div className="account-not-found">
        Account not found for ID: {id}. Check if the account ID is correct.
      </div>
    );
  }

  // Función para formatear el monto a ARS
  function formatAmountToARS(amount) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  }

  // Simplificación de los datos de transacciones para mostrar en la tabla
  const simplifiedAccount = account.transactions.map((tr) => ({
    type: tr.type,
    amount: tr.amount,
    date: tr.date.slice(0, 10),
    hour: tr.date.slice(11, 19),
    description: tr.description,
  }));

  return (
    <div className="account-details-container">
      <div className="account-info-container">
        {/* Información principal de la cuenta */}
        <div className="account-header">
          <h2 className="account-title">
            Your selected account {account.number}
          </h2>
          <div className="account-balance">
            <strong className="balance-label">Balance:</strong>{" "}
            <span
              className={
                showBalance
                  ? account.balance >= 0
                    ? "text-green-500" // Estilo verde para saldo positivo
                    : "text-red-500" // Estilo rojo para saldo negativo
                  : ""
              }
            >
              {showBalance ? formatAmountToARS(account.balance) : "••••••••"}
            </span>
            <button
              type="button"
              onClick={() => setShowBalance(!showBalance)} // Alternar la visualización del balance
              className="toggle-balance-button"
            >
              <img
                src={
                  showBalance
                    ? "https://img.icons8.com/?size=100&id=14744&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=13758&format=png&color=000000"
                }
                alt={showBalance ? "Hide balance" : "Show balance"}
                className="toggle-balance-icon"
              />
            </button>
          </div>
        </div>

        {/* Mostrar las transacciones si hay alguna disponible */}
        {simplifiedAccount.length > 0 ? (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th className="table-header">DATE</th>
                  <th className="table-header">HOUR</th>
                  <th className="table-header">TYPE</th>
                  <th className="table-header">AMOUNT</th>
                  <th className="table-header">DESCRIPTION</th>
                </tr>
              </thead>
              <tbody>
                {simplifiedAccount.map((transaction, index) => (
                  <tr
                    key={index}
                    className={`transaction-row ${transaction.type.toLowerCase()}`}
                  >
                    <td className="transaction-data">{transaction.date}</td>
                    <td className="transaction-data">{transaction.hour}</td>
                    <td
                      className={`transaction-data ${
                        transaction.type === "DEBIT" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {transaction.type}
                    </td>
                    <td
                      className={`transaction-data ${
                        transaction.type === "DEBIT" ? "text-red-500" : "text-green-500"
                      }`}
                    >
                      {formatAmountToARS(transaction.amount)}
                    </td>
                    <td className="transaction-data">{transaction.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-transactions">
            No transactions available for this account.
          </p>
        )}
      </div>
    </div>
  );
}

export default AccountDetails;
