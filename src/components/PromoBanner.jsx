import React from 'react';

function PromoBanner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-blue-100 p-8 rounded-lg shadow-lg">
      <div className="md:w-1/2 text-center md:text-left">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Discover the products we have for your business!</h2>
        <p className="text-lg text-gray-700 mb-4">
          Take your business to the next level with Openpay by BigBank. Explore the payment solutions we have for your business.
        </p>
        <button className="bg-blue-700 text-white font-semibold py-2 px-4 rounded hover:bg-blue-800">
          Learn more
        </button>
      </div>
      <div className="md:w-1/2 mt-4 md:mt-0">
        <img src="promoBanner.png" alt="Openpay by BigBank" className="rounded-lg shadow-lg" />
      </div>
    </div>
  );
}

export default PromoBanner;
