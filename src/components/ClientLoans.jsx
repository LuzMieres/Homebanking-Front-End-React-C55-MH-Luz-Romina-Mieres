import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loadClientLoans } from '../redux/actions/loanActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import '../styles/loansData.css';

const ClientLoans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { client, status: clientStatus, error: clientError } = useSelector((state) => state.currentUser);
  const { loans, status: loansStatus, error: loansError } = useSelector((state) => state.loans);

  useEffect(() => {
    if (clientStatus === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, clientStatus]);

  useEffect(() => {
    if (clientStatus === 'succeeded' && loansStatus === 'idle') {
      dispatch(loadClientLoans());
    }
  }, [dispatch, clientStatus, loansStatus]);

  // Formatear montos a la moneda ARS
  const formatAmountToARS = (amount) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  };

  // Mostrar detalles del préstamo en un modal
  const handleLoanClick = (loan) => {
    Swal.fire({
      title: 'Loan Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Loan Type:</strong> ${loan.loanName || loan.name}</p>
          <p><strong>Requested Amount:</strong> ${formatAmountToARS(loan.amountRequested)}</p>
          <p><strong>Credited Amount:</strong> ${formatAmountToARS(loan.amountCredited)}</p>
          <p><strong>Total with Interest:</strong> ${formatAmountToARS(loan.totalAmountWithInterest)}</p>
          <p><strong>Payments:</strong> ${loan.payments}</p>
          <p><strong>Deposit Account:</strong> ${loan.destinationAccountNumber || 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide',
      }
    });
  };

  if (clientStatus === 'loading' || loansStatus === 'loading') {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (clientError) {
    return <div className="text-center text-red-600">Error loading client: {clientError}</div>;
  }

  if (loansError) {
    return <div className="text-center text-red-600">Error loading loans: {loansError}</div>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center min-h-screen">
      <h2 className="text-xl sm:text-xl md:text-3xl text-blue-800 lg:text-3xl xl:text-3xl 2xl:text-[50px] mt-10 lg:mt-20">
        Your Loans
      </h2>

      {loans && loans.length > 0 ? (
        <div className="loans-table-container">
          <table className="loans-table">
            <thead>
              <tr className="loans-table-header">
                <th className="loans-table-header-cell">Loan Type</th>
                <th className="loans-table-header-cell">Requested Amount</th>
                <th className="loans-table-header-cell">Credited Amount</th>
                <th className="loans-table-header-cell">Total with Interest</th>
                <th className="loans-table-header-cell">Payments</th>
                <th className="loans-table-header-cell">Deposit Account</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr key={index} className="loans-table-row" onClick={() => handleLoanClick(loan)}>
                  <td className="loans-table-cell">{loan.loanName || 'N/A'}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.amountRequested)}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.amountCredited)}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.totalAmountWithInterest)}</td>
                  <td className="loans-table-cell">{loan.payments || 'N/A'}</td>
                  <td className="loans-table-cell">{loan.destinationAccountNumber || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-10">
          <p>You haven't requested any loans yet.</p>
        </div>
      )}

      {/* El botón siempre aparecerá debajo de la tabla o el mensaje */}
      <button
        className="request-loan-button mt-5"
        onClick={() => navigate('/newLoan')}
      >
        Request New Loan
      </button>
    </div>
  );
};

export default ClientLoans;
