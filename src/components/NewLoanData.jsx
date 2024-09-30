import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { requestNewLoanAction } from '../redux/actions/loanActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/newLoansData.css';

const availableLoans = [
  {
    name: "Mortgage",
    maxAmount: 500000,
    payments: [12, 24, 36, 48, 60, 72],
    interestRate: 20
  },
  {
    name: "Personal",
    maxAmount: 100000,
    payments: [6, 12, 24],
    interestRate: 15
  },
  {
    name: "Automotive",
    maxAmount: 300000,
    payments: [6, 12, 24, 36],
    interestRate: 18
  },
];

const NewLoanData = () => {
  const [formData, setFormData] = useState({
    name: '',
    sourceAccount: '',
    amount: '',
    payments: '',
  });

  const [errors, setErrors] = useState({
    name: 'Please select a loan type.',
    amount: 'Please enter an amount.',
    payments: 'Please select a payment option.',
    sourceAccount: 'Please select a destination account.',
  });

  const [rawAmount, setRawAmount] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amountError, setAmountError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { client, status, error } = useSelector((state) => state.currentUser);
  const { loanRequestStatus, loanRequestError } = useSelector((state) => state.loans);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error,
      });
    }
  }, [error]);

  useEffect(() => {
    const isValid = formData.name && formData.sourceAccount && rawAmount && formData.payments && !amountError && Object.keys(errors).every(key => errors[key] === '');
    setIsFormValid(isValid);
  }, [formData, rawAmount, amountError, errors]);

  function handleLoanChange(event) {
    const selectedName = event.target.value;
    const loan = availableLoans.find(l => l.name === selectedName);
    setSelectedLoan(loan);
    setFormData(prevState => ({
      ...prevState,
      name: selectedName,
      payments: '',
      amount: '',
    }));
    setRawAmount('');
    setAmountError(false);
    setErrors(prevErrors => ({
      ...prevErrors,
      name: '',
      amount: 'Please enter an amount.',
      payments: 'Please select a payment option.',
      sourceAccount: 'Please select a destination account.',
    }));
  }

  function handleAccountChange(event) {
    const selectedAccount = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      sourceAccount: selectedAccount,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      sourceAccount: selectedAccount ? '' : 'Please select a destination account.',
    }));
  }

  function handleAmountChange(event) {
    let enteredAmount = event.target.value.replace(/[^0-9]/g, '');
    setRawAmount(enteredAmount);
    setFormData(prevState => ({
      ...prevState,
      amount: enteredAmount,
    }));

    const numericAmount = enteredAmount ? parseFloat(enteredAmount) : 0;

    if (selectedLoan && numericAmount > selectedLoan.maxAmount) {
      setAmountError(true);
      setErrors(prevErrors => ({
        ...prevErrors,
        amount: `Amount cannot exceed ${formatAmountToARS(selectedLoan.maxAmount)}.`,
      }));
    } else {
      setAmountError(false);
      setErrors(prevErrors => ({
        ...prevErrors,
        amount: numericAmount > 0 ? '' : 'Please enter a valid amount.',
      }));
    }
  }

  function handlePaymentsChange(event) {
    const selectedPayments = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      payments: selectedPayments,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      payments: selectedPayments ? '' : 'Please select a payment option.',
    }));
  }

  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  function handleSubmit(event) {
    event.preventDefault();
  
    if (!isFormValid) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill in all required fields correctly.',
      });
      return;
    }
  
    const rawAmountValue = parseFloat(rawAmount);
  
    const newLoan = {
      loanName: formData.name,
      amount: rawAmountValue,
      payments: formData.payments,
      destinationAccountNumber: formData.sourceAccount,
    };
  
    // Confirmación antes de realizar la solicitud de préstamo
    Swal.fire({
      title: 'Confirm Loan Request',
      html: `
        <strong>Loan Type:</strong> ${formData.name} <br/>
        <strong>Amount:</strong> ${formatAmountToARS(rawAmountValue)} <br/>
        <strong>Payments:</strong> ${formData.payments} <br/>
        <strong>Destination Account:</strong> ${formData.sourceAccount} <br/>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(requestNewLoanAction(newLoan)); // Solicitar el préstamo si el usuario confirma
  
        // Mostrar mensaje de éxito y redirigir a la página de préstamos
        Swal.fire({
          icon: 'success',
          title: 'Loan Requested',
          text: `Your loan request has been successfully submitted for an amount of ${formatAmountToARS(rawAmountValue)}.`,
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/accounts'); // Redirigir a la página de préstamos
        });
      }
    });
  }
  

  useEffect(() => {
    if (loanRequestStatus === 'fulfilled') {
      // Mostrar mensaje de éxito y redirigir a la página de préstamos
      Swal.fire({
        icon: 'success',
        title: 'Loan Requested',
        text: `Your loan request has been successfully submitted for an amount of ${formatAmountToARS(rawAmount)}.`,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/loans');
      });
    } else if (loanRequestStatus === 'rejected') {
      // Mostrar mensaje de error si la solicitud falla
      Swal.fire({
        icon: 'error',
        title: 'Loan Request Failed',
        text: loanRequestError || 'An error occurred while processing the loan request.',
      });
    }
  }, [loanRequestStatus, loanRequestError, dispatch, navigate, rawAmount]);

  if (!client) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="new-loan-container flex flex-col items-center w-full">
      <div className="loan-form-container bg-white shadow-lg rounded-lg p-8 w-full">
        <img className="loan-image w-full h-[50vh] md:h-[80vh] md:w-[50%] mb-4 object-cover rounded" src="newLoan.png" alt="newLoan" />
        <form onSubmit={handleSubmit} className="loan-form flex flex-col w-full h-[50vh] md:h-[80vh] md:w-[50%] gap-4">
          <div className="form-group">
            <label className="form-label options" htmlFor="loanType">Select Loan Type</label>
            <select
              className={`form-select border p-2 rounded options ${!formData.name ? 'disabled' : ''}`}
              id="loanType"
              name="name"
              value={formData.name}
              onChange={handleLoanChange}
            >
              <option className='options' value="" disabled>Select a loan</option>
              {availableLoans.map(loan => (
                <option className='options' key={loan.name} value={loan.name}>{loan.name}</option>
              ))}
            </select>
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label options" htmlFor="amount">Amount</label>
            <input
              className={`form-input border p-2 rounded options ${amountError ? 'border-red-500' : ''} ${!selectedLoan ? 'disabled' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={rawAmount}
              onChange={handleAmountChange}
              disabled={!selectedLoan}
            />
            {errors.amount && <p className="text-red-500 text-xs">{errors.amount}</p>}
            {selectedLoan && (
              <p className={`amount-info ${amountError ? 'text-red-500' : 'text-gray-500'}`}>
                Max amount: {formatAmountToARS(selectedLoan.maxAmount)}
              </p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label options" htmlFor="payments">Select Payments</label>
            <select
              className={`form-select border p-2 rounded options ${!formData.amount ? 'disabled' : ''}`}
              id="payments"
              name="payments"
              value={formData.payments}
              onChange={handlePaymentsChange}
              disabled={!formData.amount}
            >
              <option className='options' value="" disabled>Select payment</option>
              {selectedLoan ? (
                selectedLoan.payments.map((payments, index) => (
                  <option className='options' key={index} value={payments}>{payments} payments</option>
                ))
              ) : (
                <option className='options' value="" disabled>Select a loan first</option>
              )}
            </select>
            {errors.payments && <p className="text-red-500 text-xs">{errors.payments}</p>}
          </div>
          <div className="form-group">
            <label className="form-label options" htmlFor="sourceAccount">Select Account</label>
            <select
              className={`form-select border p-2 rounded options ${!formData.payments ? 'disabled' : ''}`}
              id="sourceAccount"
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleAccountChange}
              disabled={!formData.payments}
            >
              <option className='options' value="" disabled>Select an account</option>
              {client.accounts.map(account => (
                <option className='options' key={account.id} value={account.number}>{account.number}</option>
              ))}
            </select>
            {errors.sourceAccount && <p className="text-red-500 text-xs">{errors.sourceAccount}</p>}
          </div>
          <button
            type="submit"
            className={`submit-button bg-blue-800 text-white p-2 rounded ${!isFormValid ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-600 transition-colors duration-300'}`}
            disabled={!isFormValid}
          >
            Request Loan
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewLoanData;
