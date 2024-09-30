import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/newTransactionsData.css';
import { useDispatch } from 'react-redux';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';

export const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts')) || [];

function NewTransactionData() {
  const [formData, setFormData] = useState({
    accountType: '', // Este será el transferType que esperas
    sourceAccount: '',
    destinationAccount: '',
    amount: '',
    description: '',
  });
  const [client, setClient] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amountError, setAmountError] = useState(false);
  const [amountInvalid, setAmountInvalid] = useState(false);
  const [destinationAccountError, setDestinationAccountError] = useState('');
  const [serverError, setServerError] = useState('');
  const [contactAccounts, setContactAccounts] = useState(savedAccounts);
  const [destinationAccountBalance, setDestinationAccountBalance] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    obtenerClient();
  }, []);

  const isFormValid = formData.sourceAccount && formData.destinationAccount && formData.amount && !amountError && !amountInvalid;

  function obtenerClient() {
    axios.get("https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/auth/current", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setClient(response.data);
      })
      .catch(error => {
        console.error("There was a problem with the request:", error);
      });
  }

  useEffect(() => {
    if (formData.sourceAccount && formData.destinationAccount) {
      const newDescription = `Transfer from ${formData.sourceAccount} to ${formData.destinationAccount}`;
      setFormData(prevState => ({
        ...prevState,
        description: newDescription,
      }));
    }
  }, [formData.sourceAccount, formData.destinationAccount]);

  function handleAccountTypeChange(event) {
    setFormData({
      ...formData,
      accountType: event.target.value,
      destinationAccount: '',
      amount: '',
    });
    setServerError('');
    setDestinationAccountError('');
    setDestinationAccountBalance(null);
  }

  function handleSourceAccountChange(event) {
    const selectedAccountNumber = event.target.value;
    
    if (client) {  
      const account = client.accounts.find(a => a.number === selectedAccountNumber);
      if (account) {
        setSelectedAccount(account);
        setFormData(prevState => ({
          ...prevState,
          sourceAccount: selectedAccountNumber,
        }));
        setAmountError(false);
        setAmountInvalid(false);
      }
    }
  }

  function handleDestinationAccountChange(event) {
    const destinationAccount = event.target.value.toUpperCase();
    setFormData(prevState => ({
      ...prevState,
      destinationAccount,
    }));
    setDestinationAccountError('');
    setServerError('');

    const validPattern = /^VIN\d*$/;
    if (formData.accountType === 'other' && destinationAccount && !validPattern.test(destinationAccount)) {
      setDestinationAccountError('Destination account must start with "VIN" followed by numbers.');
    } else {
      setDestinationAccountError('');
    }

    if (formData.accountType === 'own' && client) {
      const destinationAcc = client.accounts.find(a => a.number === destinationAccount);
      setDestinationAccountBalance(destinationAcc ? destinationAcc.balance : null);
    }
  }

  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  function handleAmountChange(event) {
    let enteredAmount = event.target.value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(enteredAmount);

    setFormData(prevState => ({
      ...prevState,
      amount: enteredAmount,
    }));

    if (isNaN(numericValue) || numericValue <= 0) {
      setAmountInvalid(true);
      setAmountError(false);
      return;
    }

    if (selectedAccount && numericValue > selectedAccount.balance) {
      setAmountError(true);
    } else {
      setAmountError(false);
    }

    setAmountInvalid(false);
  }

  function handleAmountBlur() {
    const numericValue = parseFloat(formData.amount);

    if (isNaN(numericValue) || numericValue <= 0) {
      setFormData(prevState => ({
        ...prevState,
        amount: '',
      }));
      setAmountInvalid(true);
      setAmountError(false);
      return;
    }

    setFormData(prevState => ({
      ...prevState,
      amount: numericValue.toFixed(2),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const numericAmount = parseFloat(formData.amount.replace(/[^0-9.-]+/g, ''));

    if (!formData.sourceAccount || !formData.destinationAccount || isNaN(numericAmount)) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields with valid information.',
      });
      return;
    }

    if (amountError) {
      Swal.fire({
        icon: 'error',
        title: 'Amount Exceeded',
        text: 'The amount exceeds the available balance.',
      });
      return;
    }

    if (amountInvalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Please enter a valid amount.',
      });
      return;
    }

    const newTransaction = {
      originAccountNumber: formData.sourceAccount,
      destinationAccountNumber: formData.destinationAccount,
      amount: numericAmount,
      description: formData.description,
      transferType: formData.accountType, // Aquí se envía el transferType como "own" o "other"
    };

    Swal.fire({
      title: 'Confirm Transaction',
      html: `
        <p>Type: <strong>${formData.accountType}</strong></p>
        <p>Source Account: <strong>${formData.sourceAccount}</strong></p>
        <p>Destination Account: <strong>${formData.destinationAccount}</strong></p>
        <p>Amount: <strong>${formatAmountToARS(numericAmount)}</strong></p>
        <p>Description: <strong>${formData.description}</strong></p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post("https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/transactions/", newTransaction, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
          .then(response => {
            Swal.fire({
              title: 'Transaction Successful',
              text: 'Your transaction was completed successfully!',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              dispatch(loadCurrentUserAction());
              navigate(`/accounts`);
            });
          })
          .catch(error => {
            if (error.response) {
              setServerError(error.response.data || "There was a problem with the transaction.");
            } else {
              setServerError("There was a problem with the transaction.");
            }
          });
      }
    });
  }

  return (
    <div className="new-transaction-container">
      <div className="w-full flex flex-col md:flex md:flex-row md:w-[90%] md:gap-2 lg:flex lg:flex-row xl:flex xl:flex-row 2xl:flex 2xl:flex-row">
        <img className="transaction-image" src="newTransaction.png" alt="newTransaction" />
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="account-type-container">
            <label className="account-type-label options">
              own
              <input
                type="radio"
                name="accountType"
                value="own"
                checked={formData.accountType === 'own'}
                onChange={handleAccountTypeChange}
                className="account-type-radio options"
              />
            </label>
            <label className="account-type-label options">
              other
              <input
                type="radio"
                name="accountType"
                value="other"
                checked={formData.accountType === 'other'}
                onChange={handleAccountTypeChange}
                className="account-type-radio options"
              />
            </label>
            <label className="account-type-label options">
              saved
              <input
                type="radio"
                name="accountType"
                value="saved"
                checked={formData.accountType === 'saved'}
                onChange={handleAccountTypeChange}
                className="account-type-radio options"
              />
            </label>
          </div>

          {formData.accountType === '' && <p className="error-message">Please select an account type first</p>}

          <div className="form-group options">
            <label className="form-label" htmlFor="sourceAccount">Select source account:</label>
            <select
              className={`form-select options ${formData.accountType === '' ? 'disabled' : ''}`}
              id="sourceAccount"
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleSourceAccountChange}
              disabled={formData.accountType === ''}
            >
              <option className='form-option options' value="" disabled>Select a source account:</option>
              {client?.accounts.map(account => (
                <option className='form-option options' key={account.number} value={account.number}>{account.number}</option>
              ))}
            </select>
            {!formData.sourceAccount && <p className="error-message">Please select a source account</p>}
          </div>

          <div className="form-group options">
            <label className="form-label options" htmlFor="destinationAccount">Destination account:</label>
            {formData.accountType === 'own' ? (
              <select
                className={`form-select options ${!selectedAccount ? 'disabled' : ''}`}
                id="destinationAccount"
                name="destinationAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
                disabled={!selectedAccount}
              >
                <option className='form-option options' value="" disabled>Select a destination account:</option>
                {client?.accounts
                  .filter(account => account.number !== formData.sourceAccount)
                  .map(account => (
                    <option className='form-option options' key={account.number} value={account.number}>{account.number}</option>
                  ))}
              </select>
            ) : formData.accountType === 'other' ? (
              <input
                className={`form-input options ${!selectedAccount ? 'disabled' : ''}`}
                type="text"
                id="destinationAccount"
                name="destinationAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
                placeholder="Enter destination account number (e.g., VIN123)"
                disabled={!selectedAccount}
              />
            ) : (
              <select
                className={`form-select options ${!selectedAccount ? 'disabled' : ''}`}
                id="savedAccount"
                name="savedAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
                disabled={!selectedAccount}
              >
                <option className='form-option options' value="" disabled>Select a saved account:</option>
                {contactAccounts.map((account, index) => (
                  <option className='form-option options' key={index} value={account}>{account}</option>
                ))}
              </select>
            )}
            {!formData.destinationAccount && <p className="error-message">Please select or enter a destination account</p>}
          </div>

          <div className="form-group options">
            <label className="form-label options" htmlFor="amount">Amount:</label>
            <input
              className={`form-input options ${amountError ? 'input-error' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
              disabled={!selectedAccount}
            />
            {amountInvalid && (
              <p className="error-message">Invalid amount</p>
            )}
            {selectedAccount && (
              <p className={`amount-info ${amountError ? 'text-red-500' : 'text-gray-500'}`}>
                Available balance: {formatAmountToARS(selectedAccount.balance)}
              </p>
            )}
            {!formData.amount && <p className="error-message">Please enter an amount</p>}
          </div>

          <div className="form-group options">
            <label className="form-label options" htmlFor="description">Description:</label>
            <p className="form-description options">{formData.description}</p> 
          </div>

          <button
            type="submit"
            className={`submit-button ${!isFormValid ? 'button-disabled' : ''}`}
            disabled={!isFormValid}
          >
            Send
          </button>

          {serverError && (
            <p className="error-message">{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default NewTransactionData;
