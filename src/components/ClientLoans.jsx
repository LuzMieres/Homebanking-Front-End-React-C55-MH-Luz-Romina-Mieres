import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadClientLoans } from "../redux/actions/loanActions";
import "../styles/loansData.css";

const ClientLoans = () => {
  const dispatch = useDispatch();
  const { loans, status, error } = useSelector((state) => state.loans); // Verifica que esté correctamente mapeado

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);
  
  useEffect(() => {
    if (client && loansStatus === 'idle') {
      dispatch(loadClientLoans());
    }
  }, [dispatch, client, loansStatus]);

  if (status === "loading") {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="loan-list">
      {loans && loans.length > 0 ? (
        <table className="loan-table">
          <thead>
            <tr>
              <th>Loan Name</th>
              <th>Requested Amount</th>
              <th>Credited Amount</th>
              <th>Total with Interest</th>
              <th>Payments</th>
              <th>Destination Account</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={index}>
                <td>{loan.loanName}</td>
                <td>{loan.amountRequested}</td>
                <td>{loan.amountCredited}</td>
                <td>{loan.totalAmountWithInterest}</td>
                <td>{loan.payments}</td>
                <td>{loan.destinationAccountNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600">No loans available.</div>
      )}
    </div>
  );
};

export default ClientLoans;
