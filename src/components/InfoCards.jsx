import React, { useState } from 'react';
import Swal from 'sweetalert2';

function InfoCards() {
  const handleShowInfo = (title, message) => {
    Swal.fire({
      title: title,
      text: message,
      icon: 'info',
      confirmButtonText: 'Close',
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-8 bg-blue-900">
      <div className="bg-blue-700 text-white p-6 rounded-lg shadow-lg text-center w-full md:w-1/3">
        <div className="mb-4">
          <img src="path_to_icon_1.png" alt="Financial User" className="w-12 h-12 mx-auto"/>
        </div>
        <h3 className="text-xl font-bold mb-2">Financial User</h3>
        <p className="mb-4">Information for financial users</p>
        <p className="text-sm mb-4">Access the latest news on the financial system. If you received the IFE during 2020 with BigBank, enter to know the details.</p>
        <button 
          onClick={() => handleShowInfo("Financial User", "Detailed information for financial users...")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Learn more
        </button>
      </div>

      <div className="bg-blue-700 text-white p-6 rounded-lg shadow-lg text-center w-full md:w-1/3">
        <div className="mb-4">
          <img src="path_to_icon_2.png" alt="Adhesion Contracts" className="w-12 h-12 mx-auto"/>
        </div>
        <h3 className="text-xl font-bold mb-2">Adhesion Contracts</h3>
        <p className="mb-4">Adhesion contracts - Law No. 24,240 on Consumer Protection</p>
        <p className="text-sm mb-4">Access all product contracts.</p>
        <button 
          onClick={() => handleShowInfo("Adhesion Contracts", "Detailed information on adhesion contracts...")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Access
        </button>
      </div>

      <div className="bg-blue-700 text-white p-6 rounded-lg shadow-lg text-center w-full md:w-1/3">
        <div className="mb-4">
          <img src="path_to_icon_3.png" alt="Consumer Protection" className="w-12 h-12 mx-auto"/>
        </div>
        <h3 className="text-xl font-bold mb-2">Consumer Protection</h3>
        <p className="mb-4">Consumer defense</p>
        <p className="text-sm mb-4">For complaints, click here.</p>
        <button 
          onClick={() => handleShowInfo("Consumer Protection", "Detailed information on consumer protection...")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Learn more
        </button>
      </div>
    </div>
  );
}

export default InfoCards;
