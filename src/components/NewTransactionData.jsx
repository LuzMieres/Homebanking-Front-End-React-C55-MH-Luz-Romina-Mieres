import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';
import { useDispatch } from 'react-redux';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';

export const transactionsArray = [];
export const savedAccounts = JSON.parse(localStorage.getItem('savedAccounts')) || [];

function NewTransactionData() {
  const [formData, setFormData] = useState({
    accountType: 'Own',
    sourceAccount: '',
    destinationAccount: '',
    amount: '',
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

  function obtenerClient() {
    axios.get("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/auth/current", {
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

  function handleAccountTypeChange(event) {
    setFormData({
      ...formData,
      accountType: event.target.value,
      destinationAccount: ''
    });
    setServerError('');
    setDestinationAccountError('');
    setDestinationAccountBalance(null); // Reinicia el balance de destino
  }

  function handleSourceAccountChange(event) {
    const selectedAccountNumber = event.target.value;
    const account = client?.accounts.find(a => a.number === selectedAccountNumber);

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

  function handleDestinationAccountChange(event) {
    const destinationAccount = event.target.value.toUpperCase();
    setFormData(prevState => ({
      ...prevState,
      destinationAccount,
    }));
    setDestinationAccountError('');
    setServerError('');

    const validPattern = /^VIN[A-Z0-9]*$/;
    if (formData.accountType === 'Other' && destinationAccount && !validPattern.test(destinationAccount)) {
      setDestinationAccountError('Destination account must start with "VIN" and contain only letters and numbers.');
    } else {
      setDestinationAccountError('');
    }

    if (formData.accountType === 'Own') {
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
    // Obtener el valor ingresado sin caracteres no numéricos excepto el punto decimal
    let enteredAmount = event.target.value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(enteredAmount);
  
    // Actualizar el estado con el valor numérico sin formato
    setFormData(prevState => ({
      ...prevState,
      amount: enteredAmount,
    }));
  
    // Validar si el valor es numérico y mayor a cero
    if (isNaN(numericValue) || numericValue <= 0) {
      setAmountInvalid(true);
      setAmountError(false);
      return;
    }
  
    // Verificar si el monto excede el saldo disponible
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
  
    // No formatear el monto en este punto para evitar confusión.
    // Solo mantener el valor como número sin separadores adicionales.
    setFormData(prevState => ({
      ...prevState,
      amount: numericValue.toFixed(2),
    }));
  }

  function updateAccountBalances(sourceAccountNumber, destinationAccountNumber, amount) {
    const updatedAccounts = client.accounts.map(account => {
      if (account.number === sourceAccountNumber) {
        return {
          ...account,
          balance: account.balance - amount
        };
      } else if (account.number === destinationAccountNumber) {
        return {
          ...account,
          balance: account.balance + amount
        };
      }
      return account;
    });

    setClient(prevState => ({
      ...prevState,
      accounts: updatedAccounts
    }));

    if (formData.accountType === 'Own') {
      const destinationAccount = updatedAccounts.find(account => account.number === destinationAccountNumber);
      setDestinationAccountBalance(destinationAccount.balance);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
  
    // Convertir el monto a número sin formato
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
  
    Swal.fire({
      title: 'Confirm Transaction',
      html: `
        <p>Type: <strong>${formData.accountType}</strong></p>
        <p>Source Account: <strong>${formData.sourceAccount}</strong></p>
        <p>Destination Account: <strong>${formData.destinationAccount}</strong></p>
        <p>Amount: <strong>${formatAmountToARS(numericAmount)}</strong></p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const newTransaction = {
          originAccountNumber: formData.sourceAccount,
          destinationAccountNumber: formData.destinationAccount,
          amount: numericAmount, // Enviar el valor numérico correctamente formateado
        };
  
        axios.post("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/transactions/", newTransaction, {
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
              updateAccountBalances(formData.sourceAccount, formData.destinationAccount, numericAmount);
  
              dispatch(loadCurrentUserAction());
  
              if (formData.accountType === 'Other' && !savedAccounts.includes(formData.destinationAccount)) {
                Swal.fire({
                  title: 'Save Contact',
                  text: `Do you want to save the account ${formData.destinationAccount} in your contacts?`,
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Yes, save it!',
                  cancelButtonText: 'No, cancel'
                }).then((result) => {
                  if (result.isConfirmed) {
                    savedAccounts.push(formData.destinationAccount);
                    setContactAccounts([...savedAccounts]);
                    localStorage.setItem('savedAccounts', JSON.stringify(savedAccounts));
                    Swal.fire('Saved!', `The account ${formData.destinationAccount} has been added to your contacts.`, 'success');
                  }
                });
              }
            });
          })
          .catch(error => {
            if (error.response) {
              if (error.response.data === "Destination account does not exist") {
                setDestinationAccountError("The destination account does not exist.");
              } else {
                setServerError(error.response.data || "There was a problem with the transaction.");
              }
            } else {
              setServerError("There was a problem with the transaction.");
            }
          });
      }
    });
  }
  
  if (!client) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const isFormValid = formData.sourceAccount && formData.destinationAccount && formData.amount && !amountError && !amountInvalid;

  return (
    <div className="new-transaction-container">
      <div className="transaction-form-container">
        <img className="transaction-image" src="newTransaction.png" alt="newTransaction" />
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="account-type-container">
            <label className="account-type-label">
              Own
              <input
                type="radio"
                name="accountType"
                value="Own"
                checked={formData.accountType === 'Own'}
                onChange={handleAccountTypeChange}
                className="account-type-radio"
              />
            </label>
            <label className="account-type-label">
              Other
              <input
                type="radio"
                name="accountType"
                value="Other"
                checked={formData.accountType === 'Other'}
                onChange={handleAccountTypeChange}
                className="account-type-radio"
              />
            </label>
            <label className="account-type-label">
              Saved
              <input
                type="radio"
                name="accountType"
                value="Saved"
                checked={formData.accountType === 'Saved'}
                onChange={handleAccountTypeChange}
                className="account-type-radio"
              />
            </label>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sourceAccount">Select source account:</label>
            <select
              className="form-select"
              id="sourceAccount"
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleSourceAccountChange}
            >
              <option className='form-option' value="" disabled>Select a source account:</option>
              {client.accounts.map(account => (
                <option className='form-option' key={account.number} value={account.number}>{account.number}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <p className="error-message">{serverError}</p>
            <label className="form-label" htmlFor="destinationAccount">Destination account:</label>
            {formData.accountType === 'Own' ? (
              <select
                className="form-select"
                id="destinationAccount"
                name="destinationAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
              >
                <option className='form-option' value="" disabled>Select a destination account:</option>
                {client.accounts
                  .filter(account => account.number !== formData.sourceAccount)
                  .map(account => (
                    <option className='form-option' key={account.number} value={account.number}>{account.number}</option>
                  ))}
              </select>
            ) : formData.accountType === 'Other' ? (
              <>
                <input
                  className="form-input"
                  type="text"
                  id="destinationAccount"
                  name="destinationAccount"
                  value={formData.destinationAccount}
                  onChange={handleDestinationAccountChange}
                  placeholder="Enter destination account number (e.g., VIN123)"
                />
                {destinationAccountError && (
                  <p className="error-message">{destinationAccountError}</p>
                )}
              </>
            ) : (
              <select
                className="form-select"
                id="savedAccount"
                name="savedAccount"
                value={formData.destinationAccount}
                onChange={handleDestinationAccountChange}
              >
                <option className='form-option' value="" disabled>Select a saved account:</option>
                {contactAccounts.map((account, index) => (
                  <option className='form-option' key={index} value={account}>{account}</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount:</label>
            <input
              className={`form-input ${amountError ? 'input-error' : ''}`}
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
            {formData.accountType === 'Own' && destinationAccountBalance !== null && (
              <p className="amount-info">
                Destination balance: {formatAmountToARS(destinationAccountBalance)}
              </p>
            )}
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
