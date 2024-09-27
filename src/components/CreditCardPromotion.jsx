import React from 'react';
import { useNavigate } from 'react-router-dom';

function CreditCardPromotion() {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/newCard');
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center bg-blue-900 text-white p-6">
      <div className="lg:w-1/2 p-6 text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-4">Get your credit card and take from $30,000 up to a trip to Rio</h2>
        <p className="text-lg mb-6">
          Get it bonified for 9 months. Plus, enjoy these benefits:
        </p>
        <ul className="list-disc list-inside mb-6">
          <li>Refunds in supermarkets, pet stores, ice cream shops, and much more.</li>
          <li>Exclusive benefits in theaters and concerts.</li>
          <li>Also, with your purchases, accumulate BigBank Points for travel.</li>
        </ul>
        <div className="flex flex-col lg:flex-row gap-4">
          <button 
            onClick={handleApplyClick} 
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
          >
            Apply for a card
          </button>
          <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
            Learn more
          </button>
        </div>
      </div>
      <div className="lg:w-1/2">
        <img src="rioJaneiro.jpg" alt="Credit Cards" className="w-full h-auto"/>
      </div>
    </div>
  );
}

export default CreditCardPromotion;
