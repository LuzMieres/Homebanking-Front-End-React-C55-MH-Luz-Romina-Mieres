import React from 'react';
import NewCardData from '../components/NewCardData';
import '../styles/style.css';

function NewCard() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h2 className="text-xl sm:text-xl md:text-xl text-blue-800 lg:text-3xl xl-3xl 2xl:text-[30px] 2xl:mt-20">Apply for a Card</h2>
      <NewCardData />
    </div>
  );
}

export default NewCard;
