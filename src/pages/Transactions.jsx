import React, { useEffect, useState } from "react";
import InformativeSpam from "../components/SpamInformativo";
import LabelInput from "../components/LabelInput";
import InputSelect from "../components/InputSelect";
import axios from "axios";
import Radio from "../components/inputs/Radio";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormattedNumberInput from "../components/FormattedNumberInput";
import { loadClient } from "../redux/actions/clientAction";

const Transactions = () => {
  const client = useSelector((state) => state.client.client);
  const [transactionType, setTransactionType] = useState("");
  const [accountOrigin, setAccountOrigin] = useState("");
  const [accountDestiny, setAccountDestiny] = useState("");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (client.firstName === "") {
      dispatch(loadClient())
        .unwrap() // Esto te permitirá manejar el resultado del thunk en caso de error o éxito
        .catch((error) => setError(error.message));
    }
  }, [dispatch, client.firstName]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trans = {
      amount: amount,
      description: description,
      sourceAccount: accountOrigin,
      destinationAccount: accountDestiny,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/api/transactions/clients/current/transactions",
        trans,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Transaction successful");
      dispatch(loadClient())
        .unwrap()
        .catch((error) => setError(error.message));
    } catch (error) {
      alert(error);
      alert(error);
    }
  };

  return (
    <>
      <InformativeSpam
        title="Transaction View"
        text1="Welcome to your financial management space! Here you can perform transactions and transfers quickly and securely."
        text2="You can send money, receive funds, and check the history of your transactions and transfers. Keep total control over your financial operations from one place."
        text3="Explore your options and manage your finances with ease and efficiency!"
        imgSrc="/public/transactions.png"
      />
      <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row  bg-[#C4DFFE] m-10 rounded-3xl shadow-2xl p-5">
        <div className="lg:w-1/2">
          <img src="/public/transactionsdiv.png" alt="Transaction" />
        </div>

        <div className="flex items-center justify-center lg:w-1/2">
          <form
            onSubmit={handleSubmit}
            className="h-[550px] p-10 flex flex-col justify-between gap-3 bg-[#c0c5ca7a] text-4xl rounded-3xl shadow-2xl items-center"
          >
            <h2 className="lg:text-5xl text-center border-b-2 border-black">
              Transfer
            </h2>
            <div className="flex items-center justify-between gap-3">
              <Radio
                options={["Own", "Others"]}
                onChange={(e) => setTransactionType(e.target.value)}
              />
            </div>
            <div
              className={`flex gap-3 items-center ${
                transactionType === "Others" || !transactionType
                  ? "flex-col"
                  : ""
              }`}
            >
              <InputSelect
                name="accountOrigin"
                title="Account of origin"
                options={client.accounts.map((account) => account.number)}
                onChange={(e) => {
                  setAccountOrigin(e.target.value);
                  setAccountDestiny("");
                }}
              />
              {transactionType === "Own" ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0-3.75 3.75M21 12H3"
                    />
                  </svg>

                  <InputSelect
                    name="accountDestiny"
                    title="Destination account"
                    options={client.accounts
                      .filter((account) => account.number !== accountOrigin)
                      .map((account) => account.number)}
                    onChange={(e) => setAccountDestiny(e.target.value)}
                  />
                </>
              ) : (
                <LabelInput
                  type="text"
                  name="accountNumber"
                  title="Account number"
                  onChange={(e) => setAccountDestiny(e.target.value)}
                />
              )}
            </div>
            <FormattedNumberInput
              name="amount"
              title="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <LabelInput
              type="text"
              name="description"
              title="Description"
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              className="inline-block w-full text-xl px-5 py-3 font-medium text-white bg-black rounded-lg sm:w-auto"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Transactions;
