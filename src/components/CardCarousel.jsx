import React, { useState } from 'react';
import '../styles/style.css';

const CardCarousel = ({ cards }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Función para ir a la siguiente tarjeta
  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  // Función para ir a la tarjeta anterior
  const prevCard = () => {
    setCurrentCardIndex((prevIndex) =>
      prevIndex === 0 ? cards.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="accounts-carousel-container">
      {/* Contenedor principal del carrusel */}
      <div className="accounts-carousel">
        <div
          className="accounts-carousel-inner"
          style={{ transform: `translateX(-${currentCardIndex * 100}%)` }}
        >
          {cards.map((card, index) => (
            <div key={index} className="accounts-carousel-card">
              <div
                className="account-card"
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
                }}
              >
                <div className="card-content">
                  <p className="card-number">{card.number}</p>
                  <p className="cardholder">{card.cardholder}</p>
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
                  <p className="cvv">
                    <span className="text-xs">CVV</span> {card.cvv}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="carousel-buttons">
        <button
          onClick={prevCard}
          className="prev-button"
          disabled={cards.length <= 1}
        >
          Prev
        </button>
        <button
          onClick={nextCard}
          className="next-button"
          disabled={cards.length <= 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CardCarousel;
