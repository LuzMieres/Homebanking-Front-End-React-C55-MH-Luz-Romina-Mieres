import React, { useEffect } from "react";
import Carousel from "../components/Carousel";
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
      {client.cards.length !== 0 ? <PrintCard client={client} /> : ""
      <Carousel />
    </>
  );
};

export default Cards;
