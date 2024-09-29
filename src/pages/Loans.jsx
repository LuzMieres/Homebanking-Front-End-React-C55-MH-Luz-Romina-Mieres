import React from 'react';
import '../styles/style.css';
import ClientLoans from '../components/ClientLoans';

function Loans() {
  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen">
      <h2 className="text-xl sm:text-xl md:text-3xl text-blue-800 lg:text-3xl xl:text-3xl 2xl:text-[50px] mt-10 lg:mt-20">
        Your Loans
      </h2>
      <ClientLoans />
    </div>
  );
}

export default Loans;
