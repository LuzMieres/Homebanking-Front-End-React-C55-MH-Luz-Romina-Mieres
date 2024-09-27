import React from "react";
import "../styles/App.css";
import { Link } from "react-router-dom";
const SpamInformativo = (promps) => {
  return (
    <div className="flex flex-col flex-wrap bg-gray-900 lg:py-9 lg:flex-row ">
      <div className="flex flex-col items-center w-full text-justify text-white text lg:w-1/2">
        <h2 className="flex flex-col items-center justify-center h-20 lg:mb-5 text-3xl text-center text-transparent font-extralight bg-gradient-to-r from-green-300 via-blue-500 to-[#57f857] bg-clip-text sm:text-5xl">
          ¡Welcome to QuantumBank!
        </h2>
        <h2 className="flex items-center justify-center h-20 m-2 lg:mb-5 border-b text-2xl lg:text-4xl text-center lg:border-b-4 lg:font-extralight">
          {promps.title}
        </h2>
        <div className="flex flex-col gap-4 px-5 lg:px-32 lg:text-2xl">
          <p> {promps.text1} </p>
          <p> {promps.text2} </p>
          <p> {promps.text3} </p>
        </div>
      </div>
      <div className="flex items-center justify-center  lg:w-1/2">
        <img src={promps.imgSrc} alt="" className="w-1/2 imgInformativo " />
      </div>
    </div>
  );
};

export default SpamInformativo;
