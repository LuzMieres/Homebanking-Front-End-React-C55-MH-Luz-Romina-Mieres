import React, { useState } from 'react';
import '../styles/style.css'; // Importar los estilos

const AccountsCarousel = ({ accounts, onAccountClick }) => {
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);

  // Función para ir a la siguiente cuenta
  const nextAccount = () => {
    setCurrentAccountIndex((prevIndex) => (prevIndex + 1) % accounts.length);
  };

  // Función para ir a la cuenta anterior
  const prevAccount = () => {
    setCurrentAccountIndex((prevIndex) =>
      prevIndex === 0 ? accounts.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="accounts-carousel-container">
      {/* Botón anterior */}
      <button
        onClick={prevAccount}
        className="prev-button"
        disabled={accounts.length <= 1} // Deshabilitar el botón si hay una o ninguna cuenta
      >
        Prev
      </button>

      {/* Contenedor principal para centrar la cuenta */}
      <div className="accounts-carousel">
        <div
          className="accounts-carousel-inner"
          style={{ transform: `translateX(-${currentAccountIndex * 100}%)` }}
        >
          {accounts.map((account) => (
            <div
            key={account.id}
            className="accounts-carousel-card"
            onClick={() => onAccountClick(account.id)}
          >
            {/* Contenedor de la tarjeta de cuenta */}
            <div className="account-card">
              <p className="account-number" style={{ color: 'black' }}>
                Account Number: {account.number}
              </p>
              <p className="account-balance" style={{ color: 'white' }}>
                Balance: {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(account.balance)}
              </p>
              <p className="account-creation-date">
                Creation Date: {account.creationDate || new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          
          ))}
        </div>
      </div>

      {/* Botón siguiente */}
      <button
        onClick={nextAccount}
        className="next-button"
        disabled={accounts.length <= 1} // Deshabilitar el botón si hay una o ninguna cuenta
      >
        Next
      </button>
    </div>
  );
};

export default AccountsCarousel;
