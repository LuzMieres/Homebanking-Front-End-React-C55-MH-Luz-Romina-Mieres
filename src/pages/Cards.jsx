import React from 'react';
import CardsData from '../components/CardsData';
import '../styles/style.css';

function Cards() {
  return (
    <div className="w-full flex flex-col justify-center items-center min-h-[100vh]">
      <h2 className="text-xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-[50px] text-blue-800 2xl:text-[50px] 2xl:mt-10 md:mt-[13rem]">Your Cards</h2>
      <CardsData />
    </div>
  );
}

export default Cards;
