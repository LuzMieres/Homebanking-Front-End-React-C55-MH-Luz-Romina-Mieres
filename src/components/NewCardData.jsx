import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/style.css';
import { requestNewCardAction } from '../redux/actions/cardActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';

function NewCardData() {
  const [formData, setFormData] = useState({
    cardType: '',
    cardColor: '',
  });
  const [errors, setErrors] = useState({}); // Estado para errores de validación
  const [availableColors, setAvailableColors] = useState([]); // Estado para colores disponibles
  const [availableCardTypes, setAvailableCardTypes] = useState(['DEBIT', 'CREDIT']); // Estado para tipos de tarjetas disponibles
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
    // Cargar colores disponibles en función del tipo de tarjeta seleccionada
    if (formData.cardType && client) {
      const colors = ['GOLD', 'SILVER', 'TITANIUM'];
      const ownedColors = client.cards
        .filter(card => card.type === formData.cardType)
        .map(card => card.color);
      setAvailableColors(colors.filter(color => !ownedColors.includes(color)));
    } else {
      setAvailableColors([]);
    }
  }, [formData.cardType, client]);

  useEffect(() => {
    // Filtrar tipos de tarjeta disponibles en función de las tarjetas ya solicitadas
    if (client) {
      const maxColorsPerType = 3; // Máximo número de tarjetas por tipo
      const cardTypes = ['DEBIT', 'CREDIT'];
      
      // Verificar cuántas tarjetas de cada tipo y color tiene el cliente
      const cardTypeAvailability = cardTypes.reduce((acc, type) => {
        const colorsOwned = client.cards.filter(card => card.type === type).length;
        if (colorsOwned < maxColorsPerType) {
          acc.push(type);
        }
        return acc;
      }, []);
      
      setAvailableCardTypes(cardTypeAvailability);

      // Si el tipo de tarjeta seleccionado ya no está disponible, resetear el tipo seleccionado
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
      [name]: '' // Limpiar error correspondiente cuando se selecciona un valor
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Despachar la acción para solicitar la nueva tarjeta
    dispatch(requestNewCardAction({ 
      type: formData.cardType, 
      color: formData.cardColor 
    })).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        // Volver a cargar los datos del cliente después de crear la tarjeta
        dispatch(loadCurrentUserAction()).then(() => {
          // Mostrar mensaje de confirmación y redirigir a la página de tarjetas
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
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-[90%] bg-white p-4 rounded-lg shadow-2xl gap-4">
        <img 
          className="w-full sm:w-1/2 h-auto object-cover mb-4 sm:mb-0 rounded-md" 
          src="newCard.png" 
          alt="newCard" 
        />
        <form onSubmit={handleSubmit} className="flex flex-col items-center sm:items-start w-full sm:w-1/2 gap-4">
          <div className="w-full">
            <label className="text-gray-700 text-base sm:text-lg md:text-xl block mb-2" htmlFor="cardType">Select card type</label>
            <select
              className="w-full p-2 bg-blue-700 text-white text-base sm:text-lg md:text-xl rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="cardType"
              name="cardType"
              value={formData.cardType}
              onChange={handleInputChange}
            >
              <option value="" disabled>Select a card type</option>
              {availableCardTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0) + type.slice(1).toLowerCase()}</option>
              ))}
            </select>
            {errors.cardType && <p className="text-red-500 text-sm">{errors.cardType}</p>}
          </div>
          <div className="w-full">
            <label className="text-gray-700 text-base sm:text-lg md:text-xl block mb-2" htmlFor="cardColor">Select card color</label>
            <select
              className="w-full p-2 bg-blue-700 text-white text-base sm:text-lg md:text-xl rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="cardColor"
              name="cardColor"
              value={formData.cardColor}
              onChange={handleInputChange}
              disabled={!formData.cardType} // Desactivar si no hay tipo de tarjeta seleccionado
            >
              <option value="" disabled>Select a card color</option>
              {availableColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
            {errors.cardColor && <p className="text-red-500 text-sm">{errors.cardColor}</p>}
          </div>
          <button
            type="submit"
            className={`w-full text-white p-3 rounded text-lg sm:text-base md:text-lg transition-all duration-300 ${isFormValid ? 'bg-blue-800 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
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
