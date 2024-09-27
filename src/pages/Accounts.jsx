import React, { useEffect, useState } from "react";
import Account from "../components/Account";
import Banner from "../components/Banner";
import Carousel from "../components/Carousel";
import SpamInformativo from "../components/SpamInformativo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadClient } from "../redux/actions/clientAction";
import Buttom from "../components/Buttom";

const Main = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const client = useSelector((state) => state.client.client);
  const status = useSelector((state) => state.client.status);
  console.log(client);

  // window.scrollTo(0, 0);
  
  if (client.firstName === "") {
    dispatch(loadClient());
  }

  if (error) {
    return <p>{error}</p>; // Mostrar mensaje de error si ocurre
  }

  // Verificar si el cliente existe antes de intentar acceder a sus propiedades
  if (!client) {
    return <p>No client data available.</p>; // Mostrar mensaje si no hay cliente
  }

  return (
    <>
      <SpamInformativo
        title={`🙋‍♀️Welcome ${client.firstName} ${client.lastName}`}
        text1="Here you'll find a clear and comprehensive summary of all your bank accounts. 👇"
        text2="✨ Want more details? Simply click on any account to explore more."
        text3="Enjoy a hassle-free banking experience! 🚀"
        imgSrc="/public/Finance.png"
      />
      <div className="flex flex-wrap gap-4 my-10 lg:px-80 justify-evenly bg-[#81ccc1bd] m-5 rounded-3xl p-5 shadow-2xl">
        <h2 className="w-full text-center border-b-2 border-[#111827] px-1 pb-4 text-4xl font-medium text-[#111827]">
          Accounts
        </h2>
        {client.accounts?.map((acc) => (
          <Link key={acc.id} to={`/account/${acc.id}`}>
            <Account
              account={acc.number}
              balance={acc.balance}
              openingDate={acc.creationDate}
            />
          </Link>
        ))}
        <button
          type="submit"
          className="inline-block w-full px-5 py-3 font-medium text-white bg-black rounded-lg" onChange={ (e) => console.log(e.target.value) }
           >
          Enter
        </button>
      </div>
      <Banner />
      <Carousel />
    </>
  );
};

export default Main;
