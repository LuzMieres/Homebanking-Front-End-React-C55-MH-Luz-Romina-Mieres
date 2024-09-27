import React from 'react';
import AccountDetails from '../components/AccountDetails';
import '../styles/AccountDetails.css';

function Account() {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen">
      <AccountDetails />
    </div>
  );
}

export default Account;
