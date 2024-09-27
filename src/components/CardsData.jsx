import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import CardCarousel from './CardCarousel';
import '../styles/style.css';

function CardsData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);

  // Estado local para controlar el tipo de tarjeta seleccionado
  const [selectedCardType, setSelectedCardType] = useState("CREDIT");
  const [errorMessage, setErrorMessage] = useState('');

  // Definir los límites por tipo (sin considerar color)
  const cardLimitPerType = {
    CREDIT: 3,
    DEBIT: 3,
  };

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  const handleCardTypeChange = (event) => {
    setSelectedCardType(event.target.value);
    setErrorMessage('');
  };

  const handleRequestNewCard = () => {
    const cardCountByType = client.cards.filter(
      card => card.type === selectedCardType
    ).length;

    if (cardCountByType >= cardLimitPerType[selectedCardType]) {
      setErrorMessage(`You already have ${cardLimitPerType[selectedCardType]} ${selectedCardType.toLowerCase()} cards.`);
      return;
    }

    navigate('/newCard');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  if (!client || !client.cards) {
    console.log('No client or cards available:', client);
    return <div>No cards available.</div>;
  }

  const filteredCards = client.cards.filter(card => card.type === selectedCardType);
  const cardCountByType = client.cards.filter(card => card.type === selectedCardType).length;
  const isMaxCardsReached = cardCountByType >= cardLimitPerType[selectedCardType];

  return (
    <main className="cards-container">
      <div className="card-type-selector">
        <label className="card-type-label">
          <input
            type="radio"
            name="cardType"
            value="CREDIT"
            checked={selectedCardType === "CREDIT"}
            onChange={handleCardTypeChange}
            className="form-radio"
          />
          CREDIT
        </label>
        <label className="card-type-label">
          <input
            type="radio"
            name="cardType"
            value="DEBIT"
            checked={selectedCardType === "DEBIT"}
            onChange={handleCardTypeChange}
            className="form-radio"
          />
          DEBIT
        </label>
      </div>

      {filteredCards.length > 0 ? (
        <CardCarousel cards={filteredCards} selectedCardType={selectedCardType} handleCardTypeChange={handleCardTypeChange} />
      ) : (
        <p className="no-cards-message">No {selectedCardType.toLowerCase()} cards available.</p>
      )}

      <div className="request-card-container">
        <button
          onClick={handleRequestNewCard}
          className={`request-card-button ${isMaxCardsReached ? "disabled" : ""}`}
          disabled={isMaxCardsReached}
        >
          Request New Card
        </button>
        
        {isMaxCardsReached && (
          <p className="error-message">
            You already have {cardLimitPerType[selectedCardType]} {selectedCardType.toLowerCase()} cards.
          </p>
        )}
      </div>
    </main>
  );
}

export default CardsData;
