import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/newCardsData.css'; // Importar la hoja de estilos nueva
import { requestNewCardAction } from '../redux/actions/cardActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';

function NewCardData() {
  const [formData, setFormData] = useState({
    cardType: '',
    cardColor: '',
  });
  const [errors, setErrors] = useState({});
  const [availableColors, setAvailableColors] = useState([]);
  const [availableCardTypes, setAvailableCardTypes] = useState(['DEBIT', 'CREDIT']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { client, status, error } = useSelector((state) => state.currentUser);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
      });
    }
  }, [error]);

  useEffect(() => {
    if (formData.cardType && client) {
      const colors = ['GOLD', 'SILVER', 'TITANIUM'];
      const ownedColors = client.cards
        .filter(card => card.type === formData.cardType)
        .map(card => card.color);
      setAvailableColors(colors.filter(color => !ownedColors.includes(color)));
    } else {
      setAvailableColors([]);
    }
  }, [formData.cardType, client, status]);

  useEffect(() => {
    if (client) {
      const maxColorsPerType = 3;
      const cardTypes = ['DEBIT', 'CREDIT'];

      const cardTypeAvailability = cardTypes.reduce((acc, type) => {
        const colorsOwned = client.cards.filter(card => card.type === type).length;
        if (colorsOwned < maxColorsPerType) {
          acc.push(type);
        }
        return acc;
      }, []);

      setAvailableCardTypes(cardTypeAvailability);

      if (!cardTypeAvailability.includes(formData.cardType)) {
        setFormData(prevState => ({
          ...prevState,
          cardType: '',
          cardColor: ''
        }));
      }
    }
  }, [client]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '' 
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    dispatch(requestNewCardAction({
      type: formData.cardType,
      color: formData.cardColor
    })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(loadCurrentUserAction()).then(() => {
          Swal.fire({
            title: 'Card Requested',
            text: 'Your card has been requested successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            navigate('/cards');
          });
        });
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cardType) {
      newErrors.cardType = 'Please select a card type';
    }

    if (!formData.cardColor) {
      newErrors.cardColor = 'Please select a card color';
    }

    return newErrors;
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Error loading client data.</div>;
  }

  const isFormValid = formData.cardType && formData.cardColor;

  return (
    <div className="new-card-container">
      <div className="new-card-form-container">
        <img
          className="new-card-image"
          src="newCard.png"
          alt="newCard"
        />
        <form onSubmit={handleSubmit} className="new-card-form">
          <div className="form-group options">
            <label className="form-label options" htmlFor="cardType">Select card type</label>
            <select
              className="form-select options"
              id="cardType"
              name="cardType"
              value={formData.cardType}
              onChange={handleInputChange}
            >
              <option className='options' value="" disabled>Select a card type</option>
              {availableCardTypes.map(type => (
                <option className='options' key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
              ))}
            </select>
            {errors.cardType && <p className="error-message">{errors.cardType}</p>}
          </div>
          <div className="form-group options">
            <label className="form-label options" htmlFor="cardColor">Select card color</label>
            <select
              className="form-select options"
              id="cardColor"
              name="cardColor"
              value={formData.cardColor}
              onChange={handleInputChange}
              disabled={!formData.cardType}
            >
              <option className='options' value="" disabled>Select a card color</option>
              {availableColors.map(color => (
                <option className='options' key={color} value={color}>{color}</option>
              ))}
            </select>
            {errors.cardColor && <p className="error-message">{errors.cardColor}</p>}
          </div>
          <button
            type="submit"
            className={`submit-button ${!isFormValid ? 'button-disabled' : ''}`}
            disabled={!isFormValid}
          >
            Request Card
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewCardData;
