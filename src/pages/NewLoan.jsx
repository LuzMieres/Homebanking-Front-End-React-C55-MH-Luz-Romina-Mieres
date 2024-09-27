import React from 'react';
import NewLoanData from '../components/NewLoanData';
import '../styles/style.css';

function NewLoan() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="text-xl sm:text-xl md:text-xl text-blue-800 lg:text-3xl xl:text-3xl 2xl:text-[30px] mt-5">Apply for a Loan</h2>
      <NewLoanData />
    </div>
  );
}

export default NewLoan;
