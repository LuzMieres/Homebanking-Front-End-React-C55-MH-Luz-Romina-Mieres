import React, { useState } from 'react';
import '../styles/cardCarousel.css';

const CardCarousel = ({ cards, clientName }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState(cards.map(() => false)); // Estado para las tarjetas giradas

  // Función para ir a la tarjeta seleccionada
  const selectCard = (index) => {
    setCurrentCardIndex(index);
  };

  // Función para rotar la tarjeta
  const toggleCardFlip = (index) => {
    setFlippedCards((prevFlippedCards) =>
      prevFlippedCards.map((flipped, i) => (i === index ? !flipped : flipped))
    );
  };

  return (
    <div className="accounts-carousel-container">
      {/* Contenedor principal del carrusel */}
      <div className="accounts-carousel">
        <div
          className="accounts-carousel-inner"
          style={{
            transform: `translateX(-${currentCardIndex * 410}px)`, // Deslizar en base al tamaño de la tarjeta
            width: `${cards.length * 360}px`, // Ajusta el ancho del contenedor interno según la cantidad de tarjetas
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              className={`accounts-carousel-card ${
                flippedCards[index] ? 'flipped' : ''
              }`} // Clase para tarjetas giradas
              onClick={() => toggleCardFlip(index)} // Gira la tarjeta al hacer clic
            >
              <div
                className="account-card account-card-front"
                style={{
                  backgroundImage: `url(${
                    card.color === 'GOLD'
                      ? card.type === 'CREDIT'
                        ? 'CreditCardGoldFrente.png'
                        : 'DEBITCardGoldFrente.png'
                      : card.color === 'SILVER'
                      ? card.type === 'CREDIT'
                        ? 'CreditCardSilverFrente.png'
                        : 'DEBITCardSilverFrente.png'
                      : card.type === 'CREDIT'
                      ? 'CreditCardTitaniumFrente.png'
                      : 'DEBITCardTitaniumFrente.png'
                  })`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: card.color === 'SILVER' ? 'black' : 'white', // Cambia el color de la fuente para tarjetas SILVER
                }}
              >
                {/* Contenido de la tarjeta frontal */}
                <div className="card-content">
                  <p className="card-number">{card.number}</p>
                  <p className="cardholder">
                    {clientName || card.cardholder}
                  </p>{' '}
                  {/* Mostrar nombre del cliente logueado */}
                  <p className="card-dates">
                    <span className="text-xs">FROM</span>{' '}
                    {new Date(card.fromDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}{' '}
                    <span className="text-xs">THRU</span>{' '}
                    {new Date(card.thruDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              </div>
              <div
                className="account-card account-card-back"
                style={{
                  backgroundImage: `url(${
                    card.color === 'GOLD'
                      ? card.type === 'CREDIT'
                        ? 'CardGoldDorso.png'
                        : 'CardGoldDorso.png'
                      : card.color === 'SILVER'
                      ? card.type === 'CREDIT'
                        ? 'CardSilverDorso.png'
                        : 'CardSilverDorso.png'
                      : card.type === 'CREDIT'
                      ? 'CardTitaniumDorso.png'
                      : 'CardTitaniumDorso.png'
                  })`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Posicionamiento del CVV */}
                <div className="cvv-box">
                  <p className="cvv-title">CVV</p>
                  <p className="cvv-number">{card.cvv}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs radio para navegación */}
      {cards.length > 1 && (
        <div className="carousel-radios">
          {cards.map((_, index) => (
            <label key={index} className="radio-label">
              <input
                type="radio"
                name="card-carousel"
                checked={currentCardIndex === index}
                onChange={() => selectCard(index)}
                className="radio-input"
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardCarousel;
