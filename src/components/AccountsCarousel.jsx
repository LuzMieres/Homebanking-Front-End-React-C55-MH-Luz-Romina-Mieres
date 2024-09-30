import React, { useState } from 'react';
import '../styles/accountsCarousel.css';
import { useNavigate } from 'react-router-dom';

const AccountsCarousel = ({ accounts }) => {
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const navigate = useNavigate(); // Para redirigir a la página de detalles de la cuenta

  // Función para seleccionar la cuenta con radio buttons
  const selectAccount = (index) => {
    setCurrentAccountIndex(index);
  };

  // Función para redirigir al hacer clic en una cuenta
  const handleAccountClick = (account) => {
    navigate(`/account/${account.id}`); // Redirige a los detalles de la cuenta
  };

  return (
    <div className="accounts-carousel-container">
      <p className="click-instruction">Click on the account to view details</p>
      <div className="accounts-carousel">
        <div
          className="accounts-carousel-inner"
          style={{
            transform: `translateX(-${currentAccountIndex * 400}px)`, // Desliza una tarjeta a la vez
            width: `${accounts.length * 400}px`, // Ajusta el ancho del contenedor interno
          }}
        >
          {accounts.map((account, index) => (
            <div
              key={index}
              className="accounts-carousel-card"
              onClick={() => handleAccountClick(account)} // Redirige a los detalles al hacer clic en la cuenta
            >
              <div className="account-card">
                {/* Tarjeta con los detalles de la cuenta */}
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Radio buttons para deslizar el carrusel */}
      {accounts.length > 1 && (
        <div className="carousel-radios">
          {accounts.map((_, index) => (
            <label key={index} className="radio-label">
              <input
                type="radio"
                name="account-carousel"
                checked={currentAccountIndex === index}
                onChange={() => selectAccount(index)} // Cambiar la cuenta visible en el carrusel
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
