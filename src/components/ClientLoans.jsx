import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadClientLoans } from '../redux/actions/loanActions';
import '../styles/style.css';

const ClientLoans = () => {
  const dispatch = useDispatch();
  const { clientLoans, status, error } = useSelector(state => state.clientLoans);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadClientLoans());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (clientLoans) {
      setLoans(clientLoans);
    }
  }, [clientLoans]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="loan-list">
      {loans.length > 0 ? (
        <table className="loan-table">
          <thead>
            <tr>
              <th>Loan Name</th>
              <th>Requested Amount</th>
              <th>Credited Amount</th>
              <th>Total with Interest</th>
              <th>Remaining Payments</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan.id}>
                <td>{loan.loanType}</td>
                <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(loan.amount)}</td>
                <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(loan.creditedAmount)}</td>
                <td>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(loan.totalAmount)}</td>
                <td>{loan.remainingPayments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No loans found</div>
      )}
    </div>
  );
};

export default ClientLoans;
