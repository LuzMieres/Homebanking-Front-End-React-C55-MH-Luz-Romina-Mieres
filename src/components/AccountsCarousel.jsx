import React, { useState } from 'react';
import '../styles/accountsCarousel.css';
import { useNavigate } from 'react-router-dom'; // Para redirigir a la página de nuevas transferencias

const AccountsCarousel = ({ accounts }) => {
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [flippedAccounts, setFlippedAccounts] = useState(accounts.map(() => false)); // Estado para las tarjetas giradas
  const navigate = useNavigate(); // Para redirigir a la nueva transferencia

  // Función para seleccionar la cuenta
  const selectAccount = (index) => {
    setCurrentAccountIndex(index);
  };

  // Función para girar la tarjeta de la cuenta
  const toggleAccountFlip = (index) => {
    setFlippedAccounts((prevFlippedAccounts) =>
      prevFlippedAccounts.map((flipped, i) => (i === index ? !flipped : flipped))
    );
  };

  return (
    <div className="accounts-carousel-container">
      <p className="click-instruction">Click on the account to see more details</p> {/* Mensaje para el usuario */}
      <div className="accounts-carousel">
        <div
          className="accounts-carousel-inner"
          style={{
            transform: `translateX(-${currentAccountIndex * 400}px)`, // Desliza por completo, solo muestra una tarjeta a la vez
            width: `${accounts.length * 400}px`, // Ajusta el ancho del contenedor interno para que coincida con las tarjetas
          }}
        >
          {accounts.map((account, index) => (
            <div
              key={index}
              className="accounts-carousel-card"
              onClick={() => toggleAccountFlip(index)} // Gira la tarjeta al hacer clic
            >
              <div className={`account-card ${flippedAccounts[index] ? 'flipped' : ''}`}>
                {/* Tarjeta frontal con los detalles de la cuenta */}
                <div className="account-card-front">
                  <div className="card-content">
                    <p className="account-number">Account Number: {account.number}</p>
                    <p className="account-balance">
                      Balance: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(account.balance)}
                    </p>
                    <p className="account-creation-date">
                      Creation Date: {account.creationDate || new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Tarjeta trasera con la tabla de transacciones */}
                <div className="account-card-back">
                  <div className="back-card-content">
                    <h3 className="transactions-title">Transactions</h3>
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
                              <td className="transaction-data">{transaction.date.slice(0, 10)}</td>
                              <td className={`transaction-data ${transaction.type === 'DEBIT' ? 'text-red' : 'text-green'}`}>
                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(transaction.amount)}
                              </td>
                              <td className="transaction-data">{transaction.type}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="no-transactions">No transactions available.</p>
                    )}

                    {/* Botón para nueva transferencia */}
                    <button
                      className="new-transaction-button"
                      onClick={() => navigate('/newTransaction')} // Redirigir a la página de nueva transacción
                    >
                      New Transfer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs radio para navegación */}
      {accounts.length > 1 && (
        <div className="carousel-radios">
          {accounts.map((_, index) => (
            <label key={index} className="radio-label">
              <input
                type="radio"
                name="account-carousel"
                checked={currentAccountIndex === index}
                onChange={() => selectAccount(index)}
                className="radio-input"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountsCarousel;
