import React, { useState } from "react";
import Buttom from "./Buttom";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="h-20 z-50 flex  justify-between items-center sticky top-0 bg-[#dbd9fbf1] shadow-xl p-4 lg:p-0 lg:flex-row lg:justify-evenly">
      <Link to="/accounts" className="flex gap-4 items-center">
        <img
          src="/public/unnamed.jpeg"
          alt=""
          className="object-cover w-12 h-12 lg:w-16 lg:h-16 rounded-full"
        />
        <h1 className="text-2xl lg:text-3xl font-bold">QuantumBank</h1>
      </Link>

      <button onClick={toggleMenu} className="lg:hidden">
        {/* Espacio para la imagen del icono del menú */}
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
            d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
          />
        </svg>
      </button>

      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } flex flex-col lg:flex-row absolute lg:static top-20 left-0 w-full lg:w-auto bg-[#dbd9fbf1] lg:flex lg:items-center lg:gap-4 transition-all duration-300 ease-in-out lg:block`}
      >
        <Link to="/accounts" onClick={() => setIsMenuOpen(false)}>
          <Buttom
            title="Accounts"
            href="/accounts"
            isActive={location.pathname.startsWith("/account")}
          />
        </Link>
        <Link to="/Cards" onClick={() => setIsMenuOpen(false)}>
          <Buttom
            title="Cards"
            href="/Cards"
            isActive={
              location.pathname.startsWith("/cards") ||
              location.pathname.startsWith("/Card")
            }
          />
        </Link>
        <Link to="/Loans" onClick={() => setIsMenuOpen(false)}>
          <Buttom
            title="Loans"
            href="/Loans"
            isActive={location.pathname === "/Loans"}
          />
        </Link>
        <Link to="/transactions" onClick={() => setIsMenuOpen(false)}>
          <Buttom
            title="Transactions"
            href="/transactions"
            isActive={location.pathname === "/transactions"}
          />
        </Link>
      </nav>

      <Link to="/login" className="hidden lg:block">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 duration-200 hover:stroke-[#4F46E5] hover:transform hover:scale-150"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </Link>
    </header>
  );
};

export default Header;
