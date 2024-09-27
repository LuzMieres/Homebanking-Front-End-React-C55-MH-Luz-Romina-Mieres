import React, { useContext } from 'react';
import NewTransactionData from '../components/NewTransactionData';
import { TransactionsContext } from '../context/TransactionsContext';
import '../styles/style.css';

function NewTransaction() {
  const { addTransaction } = useContext(TransactionsContext);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="text-xl sm:text-xl md:text-xl text-blue-800 lg:text-3xl xl:text-3xl 2xl:text-[30px] mt-5">Make a Transaction</h2>
      <NewTransactionData addTransaction={addTransaction} />
    </div>
  );
}

export default NewTransaction;
