import React, { useEffect } from "react";
import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import SpamInformativo from "../components/SpamInformativo";
import PrintCard from "../components/PrintCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadClient } from "../redux/actions/clientAction";

const Cards = () => {
  const client = useSelector((state) => state.client.client);

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

  return (
    <>
      <SpamInformativo
        title="Detailed View of Your Cards"
        text1="Here you can view all the cards associated with your accounts."
        text2="✨ You can see the card number, type (credit or debit), color, and expiration date of each one."
        text3="Explore your options and maintain full control of your cards from one place! 🚀"
        imgSrc="/public/Payment.png"
      />
      {client.cards.length !== 0 ? <PrintCard client={client} /> : ""}
      <Banner />
      <Carousel />
    </>
  );
};

export default Cards;
