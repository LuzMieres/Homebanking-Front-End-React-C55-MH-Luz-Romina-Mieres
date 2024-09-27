import React from "react";
import Button from "./Buttom";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <section className="text-white bg-gray-900">
      <div className="max-w-screen-xl px-4 py-20 mx-auto lg:flex lg:items-center">
        <div className="mx-auto max-w-1xl">
          <h1 className="pb-4 text-3xl font-extrabold text-transparent bg-gradient-to-r from-green-300 via-blue-500 to-purple-400 bg-clip-text sm:text-5xl">
            Apply for your credit card and get from
            $30,000 to a trip to Rio!
          </h1>
          <span className="my-5 sm:block text-xl/relaxed">
            Hire it bonified for 9 months. Plus, enjoy these benefits:
          </span>

          <ul className="max-w-3xl mx-auto mt-4 space-y-3 sm:text-xl/relaxed">
            <li>
              ✔️ Refunds in supermarkets, pet stores, ice cream shops and much
              more.
            </li>
            <li>✔️ Exclusive benefits in theaters and concerts.</li>
            <li>
              ✔️ Plus, with your purchases, you accumulate points to travel.
            </li>
          </ul>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/cards/addCard">
              <Button href="#" title="Apply for card"></Button>
            </Link>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
