import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loadClientLoans } from '../redux/actions/loanActions';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction'; // Corrige la importación
import '../styles/loansData.css';

function LoansData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser); // Verifica que el estado sea correcto
  const { loans, status: loansStatus } = useSelector((state) => state.loans); // Asegúrate de que loans está correctamente mapeado en tu store

  useEffect(() => {
    // Verifica que el cliente esté cargado y la lista de préstamos esté en estado idle antes de cargar
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  useEffect(() => {
    // Carga los préstamos del cliente si el cliente está cargado y los préstamos están en estado idle
    if (client && loansStatus === 'idle') {
      dispatch(loadClientLoans());
    }
  }, [dispatch, client, loansStatus]);

  // Logs para verificar el estado de los datos
  useEffect(() => {
    console.log("Datos del cliente:", client);
    console.log("Lista de préstamos:", loans);
  }, [client, loans]);

  if (status === 'loading' || loansStatus === 'loading') {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (status === 'failed') {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (loansStatus === 'failed') {
    return <div className="text-center text-red-600">Error loading loans: {error}</div>;
  }

  function formatAmountToARS(amount) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return 'N/A';
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  function handleRowClick(loan) {
    Swal.fire({
      title: 'Loan Details',
      html: `
        <div style="text-align: left;">
          <p><strong>Loan Type:</strong> ${loan.loanType || loan.name}</p>
          <p><strong>Requested Amount:</strong> ${formatAmountToARS(loan.amount)}</p>
          <p><strong>Credited Amount:</strong> ${formatAmountToARS(loan.creditedAmount)}</p>
          <p><strong>Total with Interest:</strong> ${formatAmountToARS(loan.totalAmount)}</p>
          <p><strong>Payments:</strong> ${loan.payments}</p>
          <p><strong>Deposit Account:</strong> ${loan.depositAccount || 'N/A'}</p>
        </div>
      `,
      icon: 'info',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'swal-wide',
      }
    });
  }

  return (
    <main className="loans-container">
      <div className="loans-instruction">
        Please select a loan to view details.
      </div>

      {loans && loans.length > 0 ? (
        <div className="loans-table-container">
          <table className="loans-table">
            <thead>
              <tr className="loans-table-header">
                <th className="loans-table-header-cell">LOAN TYPE</th>
                <th className="loans-table-header-cell">REQUESTED AMOUNT</th>
                <th className="loans-table-header-cell">CREDITED AMOUNT</th>
                <th className="loans-table-header-cell">TOTAL WITH INTEREST</th>
                <th className="loans-table-header-cell">PAYMENTS</th>
                <th className="loans-table-header-cell">DEPOSIT ACCOUNT</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan, index) => (
                <tr
                  key={index}
                  className="loans-table-row"
                  onClick={() => handleRowClick(loan)}
                >
                  <td className="loans-table-cell">{loan.loanType || loan.name}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.amount)}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.creditedAmount)}</td>
                  <td className="loans-table-cell">{formatAmountToARS(loan.totalAmount)}</td>
                  <td className="loans-table-cell">{loan.payments}</td>
                  <td className="loans-table-cell">{loan.depositAccount || 'N/A'}</td> {/* Revisa que depositAccount tenga el valor correcto */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-loans-message">No loans available.</div>
      )}

      <button
        className="request-loan-button"
        onClick={() => navigate('/newLoan')}
      >
        Request New Loan
      </button>
    </main>
  );
}

export default LoansData;
