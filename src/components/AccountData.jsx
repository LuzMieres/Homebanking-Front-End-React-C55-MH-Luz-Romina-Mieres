import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { loadCurrentUserAction } from "../redux/actions/loadCurrentUserAction";
import "../styles/accountDetails.css";

function AccountData() {
  const { id } = useParams(); // Obtener el ID de la cuenta desde los parámetros de la URL
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(false); // Estado para mostrar/ocultar el balance

  const { client, status, error } = useSelector((state) => state.currentUser);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!client && status === "idle") {
      dispatch(loadCurrentUserAction());
    } else if (client && client.accounts) {
      const selectedAccount = client.accounts.find(
        (acc) => acc.id === parseInt(id)
      );
      setAccount(selectedAccount);
    }
  }, [client, id, status, dispatch]);

  if (status === "loading") {
    return <div>Loading account data...</div>;
  }

  if (status === "failed") {
    return <div>Error loading account data: {error}</div>;
  }

  if (!account) {
    return <div>Account not found for ID: {id}</div>;
  }

  return (
    <div className="account-card">
      {/* Tarjeta con los detalles de la cuenta */}
      <div className="account-card-front">
        <div className="card-content">
          <p className="account-number">Account Number: {account.number}</p>
          <p className="account-balance">
            Balance:{" "}
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
            }).format(account.balance)}
          </p>
          <p className="account-creation-date">
            Creation Date:{" "}
            {account.creationDate || new Date().toLocaleDateString()}
          </p>

          <h3 className="transactions-title">Recent Transactions</h3>
          {account.transactions && account.transactions.length > 0 ? (
            <table className="transactions-table">
              <thead>
                <tr>
                  <th className="table-header">DATE</th>
                  <th className="table-header">AMOUNT</th>
                  <th className="table-header">TYPE</th>
                </tr>
              </thead>
              <tbody>
                {account.transactions.slice(0, 5).map((transaction, i) => (
                  <tr key={i} className="transaction-row">
                    <td className="transaction-data">
                      {transaction.date.slice(0, 10)}
                    </td>
                    <td
                      className={`transaction-data ${
                        transaction.type === "DEBIT" ? "text-red" : "text-green"
                      }`}
                    >
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      }).format(transaction.amount)}
                    </td>
                    <td className="transaction-data">{transaction.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-transactions">No transactions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountData;
