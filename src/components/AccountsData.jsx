import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadCurrentUserAction } from "../redux/actions/loadCurrentUserAction";
import AccountsCarousel from './AccountsCarousel'; // Importar el componente AccountsCarousel

function AccountsData() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client, status, error } = useSelector((state) => state.currentUser);

  const [errorMessage, setErrorMessage] = useState('');
  const accountLimit = 3;

  useEffect(() => {
    if (status === "idle") {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);

  const handleRequestNewAccount = () => {
    const accountCount = client.accounts.length;

    if (accountCount >= accountLimit) {
      setErrorMessage(`You already have ${accountLimit} accounts, you can't request more.`);
      return;
    }

    navigate("/newAccount");
  };

  const handleAccountClick = (accountId) => {
    navigate(`/account/${accountId}`);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  if (!client || !client.accounts) {
    return <div>No accounts available.</div>;
  }

  const accountCount = client.accounts.length;
  const isMaxAccountsReached = accountCount >= accountLimit;

  return (
    <main className="accounts-container">
      {client.accounts.length > 0 ? (
        <AccountsCarousel accounts={client.accounts} onAccountClick={handleAccountClick} />
      ) : (
        <p className="no-accounts-message">No accounts available.</p>
      )}

      <div className="request-account-container">
        <button
          onClick={handleRequestNewAccount}
          className={`request-account-button ${isMaxAccountsReached ? "disabled" : ""}`}
          disabled={isMaxAccountsReached}
        >
          Request New Account
        </button>

        {isMaxAccountsReached && (
          <p className="error-message">
            You already have {accountLimit} accounts, you can't request more.
          </p>
        )}
      </div>
    </main>
  );
}

export default AccountsData;
