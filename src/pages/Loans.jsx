import React, { useEffect, useState } from "react";
import InformativeSpam from "../components/SpamInformativo";
import axios from "axios";
import Table from "../components/Table";
import InputSelect from "../components/InputSelect";
import Radio from "../components/inputs/Radio";
import FormattedNumberInput from "../components/FormattedNumberInput";
import { useDispatch, useSelector } from "react-redux";
import { loadClient } from "../redux/actions/clientAction";
import { useNavigate } from "react-router-dom";

const Loans = () => {
  const [transactionType, setTransactionType] = useState("");
  const [accountOrigin, setAccountOrigin] = useState("");
  const [amount, setAmount] = useState("");
  const [payments, setPayments] = useState([]);
  const [paymentSelected, setPaymentSelected] = useState("");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const client = useSelector((state) => state.client.client);
  const [loansAvailable, setLoans] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (client.loans?.length <= 3) {
      const token = localStorage.getItem("token");

      axios
        .get("http://localhost:8080/api/loans/loansAvailable", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setLoans(response.data);
        })
        .catch((error) => {
          console.error("Error fetching loans:", error);
        });
    }
  }, [client.loans]);

  useEffect(() => {
    if (!client.firstName) {
      dispatch(loadClient())
        .unwrap()
        .catch((error) => console.error(error.message));
    }
  }, [client.firstName, dispatch]);

  const simplifiedLoans = Array.isArray(client.loans)
    ? client.loans.map((loan) => ({
        name: loan.name,
        amount: loan.amount,
        payments: loan.payments,
      }))
    : [];

  const handleSubmit = (event) => {
    event.preventDefault();
    const trans = {
      id:
        transactionType === "Hipotecario"
          ? 1
          : transactionType === "Automotriz"
          ? 3
          : 2,
      amount: amount,
      payments: paymentSelected.slice(0, 2).toString(),
      destinationAccount: accountOrigin,
    };

    axios
      .post("http://localhost:8080/api/loans/apply", trans, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        alert("Loan applied successfully");
        dispatch(loadClient());
        navigate("/accounts/");
      })
      .catch((error) => {
        console.error("Error applying loan:", error);
      });
  };

  const handleTransactionTypeChange = (e) => {
    const selectedLoanName = e.target.value;
    setTransactionType(selectedLoanName);

    const selectedLoanData = loansAvailable.find(
      (loan) => loan.name === selectedLoanName
    );

    if (selectedLoanData) {
      setSelectedLoan(selectedLoanData);
      setPayments(
        selectedLoanData.payments.map((payment) => `${payment} payments`)
      );
    }
  };

  const handleAccountOriginChange = (e) => {
    setAccountOrigin(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div>
      <InformativeSpam
        title="Detailed view of your loans"
        text1="Welcome to your new loan section! Here you can view or request loans quickly and easily."
        text2="Choose the type of loan you need, define the amount you want to request, and send your request."
        text3="Explore the available options and request your loan today!"
        imgSrc="/public/loan.png"
      />
      <div className="bg-[#69c2b6d7] m-3 p-2 rounded-3xl shadow lg:m-10 lg:shadow-2xl lg:p-10">
        <div className="flex flex-col lg:flex-row lg:py-5 justify-evenly">
          {simplifiedLoans.length === 0 ? (
            <div className="flex items-center justify-center lg:w-1/2">
              <h2 className="text-3xl text-center bg-white m-5 p-5 rounded-3xl shadow-2xl">
                You don't have any active loans yet! Take this opportunity to
                request your first loan and get the financial support you need.
                Our process is fast, simple, and designed to help you every step
                of the way. Explore the available options and get started today!
              </h2>
            </div>
          ) : (
            <div className="flex items-center  justify-center lg:w-1/2">
              <Table
                title="Loans"
                ths={["Type", "Amount", "Payments"]}
                tds={simplifiedLoans}
              />
            </div>
          )}

          <div className="flex items-center justify-center">
            {client.loans?.length < 3 ? (
              <form
                onSubmit={handleSubmit}
                className="p-10 flex flex-col gap-3 bg-[#c0c5ca7a] text-4xl rounded-3xl shadow-2xl items-center"
              >
                <h2 className="lg:text-5xl text-center border-b-2 border-black">
                  Request a loan
                </h2>

                <div className="flex items-center justify-between gap-3">
                  <Radio
                    options={loansAvailable.map((loan) => loan.name)}
                    onChange={handleTransactionTypeChange}
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <InputSelect
                    name="account"
                    title="Account of origin"
                    options={
                      client.accounts?.map((account) => account.number) || []
                    }
                    onChange={handleAccountOriginChange}
                  />
                  <InputSelect
                    name="payments"
                    title={!selectedLoan ? `Select a loan` : "Payments"}
                    options={payments}
                    onChange={(e) => setPaymentSelected(e.target.value)}
                  />
                </div>

                <FormattedNumberInput
                  name="amount"
                  title="Amount"
                  value={amount}
                  onChange={handleAmountChange}
                />

                <button
                  type="submit"
                  className="inline-block w-full px-5 py-3 font-medium text-white bg-black rounded-lg sm:w-auto"
                >
                  Send Enquiry
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center w-1/2">
                <h2 className="text-xl text-center m-2 p-2 border-blue-400 border-8 bg-white lg:m-5 lg:p-5 rounded-3xl shadow-2xl lg:text-3xl">
                  You have reached the limit of loans you can request.
                </h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loans;
