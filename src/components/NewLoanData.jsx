import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { requestNewLoanAction } from '../redux/actions/loanActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/style.css';

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
  // Los hooks deben estar dentro del componente funcional
  const [formData, setFormData] = useState({
    name: '',
    sourceAccount: '',
    amount: '',
    payments: '',
    description: '', // Añadir descripción al estado inicial
  });

  const [errors, setErrors] = useState({});
  const [rawAmount, setRawAmount] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [amountError, setAmountError] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { client, status, error } = useSelector((state) => state.currentUser);
  const { loanRequestStatus, loanRequestError } = useSelector((state) => state.loans); // Asegúrate de tener el estado correcto del reducer

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
    const isValid = formData.name && formData.sourceAccount && rawAmount && formData.payments && formData.description && !amountError && Object.keys(errors).length === 0;
    setIsFormValid(isValid);
  }, [formData, rawAmount, amountError, errors]);


  function handleLoanChange(event) {
    const selectedName = event.target.value;
    const loan = availableLoans.find(l => l.name === selectedName);
    setSelectedLoan(loan);
    setFormData(prevState => ({
      ...prevState,
      name: selectedName,
      payments: '', // Resetea el valor de payments
      amount: '',
    }));
    setRawAmount('');
    setAmountError(false);
    setErrors(prevErrors => ({
      ...prevErrors,
      name: loan ? '' : 'Please select an loan type.',
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
      sourceAccount: selectedAccount ? '' : 'Please select an account.',
    }));
  }

  function handleDescriptionChange(event) {
    const description = event.target.value;
    setFormData(prevState => ({
      ...prevState,
      description,
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      description: description ? '' : 'Please enter a description.',
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
      payments: selectedPayments ? '' : 'Please select a payment.',
    }));
  }

  function handleAmountBlur() {
    const numericValue = rawAmount ? parseFloat(rawAmount) : '';
    if (!isNaN(numericValue)) {
      const formattedAmount = formatAmountToARS(numericValue);
      setFormData(prevState => ({
        ...prevState,
        amount: formattedAmount,
      }));
    }
  }

  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return '';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  function calculateTotalWithInterest(amount, interestRate) {
    return amount + (amount * interestRate / 100);
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

    if (amountError) {
      Swal.fire({
        icon: 'error',
        title: 'Amount Exceeded',
        text: 'The amount exceeds the maximum allowed for this loan.',
      });
      return;
    }

    const rawAmountValue = parseFloat(rawAmount);
    const totalWithInterest = calculateTotalWithInterest(rawAmountValue, selectedLoan.interestRate);

    const newLoan = {
      loanName: formData.name,
      amount: rawAmountValue,
      totalAmount: totalWithInterest,
      payments: formData.payments,
      destinationAccountNumber: formData.sourceAccount,
      description: formData.description, // Incluir la descripción en la solicitud
    };
    

    Swal.fire({
      title: 'Confirm Loan Request',
      html: `
        <strong>Loan Type:</strong> ${formData.name} <br/>
        <strong>Amount:</strong> ${formatAmountToARS(rawAmountValue)} <br/>
        <strong>Payments:</strong> ${formData.payments} <br/>
        <strong>Total with Interest:</strong> ${formatAmountToARS(totalWithInterest)} <br/>
        <strong>Description:</strong> ${formData.description} <br/>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User confirmed the loan request');
        dispatch(requestNewLoanAction(newLoan));
      }
    });
  }

  // Manejar cambios de estado de la solicitud de préstamo
  useEffect(() => {
    if (loanRequestStatus === 'fulfilled') {
      console.log('Loan request completed successfully');
      // Cargar nuevamente la información del cliente antes de redirigir
      dispatch(loadCurrentUserAction()).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Loan Requested',
          text: `Your loan request has been successfully submitted for an amount of ${formatAmountToARS(rawAmount)}.`,
          timer: 1500,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate('/loans'); // Navega a la página de préstamos
        }, 1500);
      });
    } else if (loanRequestStatus === 'rejected') {
      console.log('Loan request failed:', loanRequestError);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: loanRequestError || 'An error occurred while requesting the loan. Please try again later.',
      });
    }
  }, [loanRequestStatus, loanRequestError, dispatch, navigate, rawAmount]);

  if (!client) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="new-loan-container flex flex-col items-center">
      <div className="loan-form-container bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <img className="loan-image w-full h-32 mb-4 object-cover rounded" src="newLoan.png" alt="newLoan" />
        <form onSubmit={handleSubmit} className="loan-form flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="loanType">Select Loan Type</label>
            <select
              className={`form-select border p-2 rounded ${!formData.name ? 'disabled' : ''}`}
              id="loanType"
              name="name"
              value={formData.name}
              onChange={handleLoanChange}
            >
              <option value="" disabled>Select a loan</option>
              {availableLoans.map(loan => (
                <option key={loan.name} value={loan.name}>{loan.name}</option>
              ))}
            </select>
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Amount</label>
            <input
              className={`form-input border p-2 rounded ${amountError ? 'border-red-500' : ''} ${!selectedLoan ? 'disabled' : ''}`}
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleAmountChange}
              onBlur={handleAmountBlur}
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
            <label className="form-label" htmlFor="payments">Select Payments</label>
            <select
              className={`form-select border p-2 rounded ${!formData.amount ? 'disabled' : ''}`}
              id="payments"
              name="payments"
              value={formData.payments}
              onChange={handlePaymentsChange}
              disabled={!formData.amount}
            >
              <option value="" disabled>Select payment</option>
              {selectedLoan ? (
                selectedLoan.payments.map((payments, index) => (
                  <option key={index} value={payments}>{payments} payments</option>
                ))
              ) : (
                <option value="" disabled>Select a loan first</option>
              )}
            </select>
            {errors.payments && <p className="text-red-500 text-xs">{errors.payments}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sourceAccount">Select Account</label>
            <select
              className={`form-select border p-2 rounded ${!formData.payments ? 'disabled' : ''}`}
              id="sourceAccount"
              name="sourceAccount"
              value={formData.sourceAccount}
              onChange={handleAccountChange}
              disabled={!formData.payments}
            >
              <option value="" disabled>Select an account</option>
              {client.accounts.map(account => (
                <option key={account.id} value={account.number}>{account.number}</option>
              ))}
            </select>
            {errors.sourceAccount && <p className="text-red-500 text-xs">{errors.sourceAccount}</p>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <input
              className="form-input border p-2 rounded"
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Enter a description"
            />
            {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
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
