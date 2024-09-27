import React from 'react';
import { useSelector } from 'react-redux';
import AccountsData from '../components/AccountsData';
import '../styles/style.css';

function Accounts() {
  const { client } = useSelector((state) => state.currentUser); // Obtener el cliente desde el estado global

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex justify-center items-center mt-10 2xl:mt-[2.5rem] relative">
        <h2 className="text-3xl text-center text-blue-800 lg:text-3xl xl:text-[40px] 2xl:text-[80px] 2xl:mb-[2rem]">
          {/* Mostrar el mensaje de bienvenida si el cliente está cargado */}
          {client ? `👋 Welcome, ${client.firstName} ${client.lastName}!` : ''}
        </h2>
      </div>
      <h3 className="text-xl sm:text-xl md:text-xl text-blue-800 lg:text-3xl xl:text-[40px] 2xl:text-[50px] mb-5 mt-5">Your Accounts</h3>
      <div className="w-full flex flex-col items-center gap-6 xl:justify-between xl:min-h-[70vh]">
        <AccountsData />
      </div>
    </div>
  );
}

export default Accounts;
