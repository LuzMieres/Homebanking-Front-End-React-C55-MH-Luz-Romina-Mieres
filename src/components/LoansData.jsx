import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';

function LoansData() {
  const { client } = useSelector((state) => state.currentUser || {});
  const [loans, setLoans] = useState(client?.loans || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (client && Array.isArray(client.loans)) {
      setLoans(client.loans);
    } else {
      setLoans([]);
      console.error("Unexpected response format: expected an array but got", client?.loans);
    }
  }, [client]);

  return (
    <main className="loans-container">
      {loans.length > 0 ? (
        <>
          <div className="loans-instruction">
            Please select a loan to view details.
          </div>
          <table className="loans-table">
            <thead>
              <tr className="loans-table-header">
                <th className="loans-table-header-cell">Loan Type</th>
                <th className="loans-table-header-cell">Amount Requested</th>
                <th className="loans-table-header-cell">Amount Credited</th>
                <th className="loans-table-header-cell">Total with Interest</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="loans-table-row">
                  <td className="loans-table-cell">{loan.name}</td>
                  <td className="loans-table-cell">{loan.amount}</td>
                  <td className="loans-table-cell">{loan.amount}</td>
                  <td className="loans-table-cell">{loan.totalAmountWithInterest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
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
