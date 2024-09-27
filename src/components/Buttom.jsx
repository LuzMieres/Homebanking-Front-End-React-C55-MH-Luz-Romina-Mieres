import React from "react";

const Buttom = ({ href, title, isActive }) => {
  const isDefaultHref = href === "#";

  return (
    <a
      className={`inline-block w-full text-center  duration-300 rounded border px-12 py-3 text-lg font-medium focus:outline-none focus:ring 
      ${isDefaultHref ? "border-indigo-600 bg-indigo-600 text-white hover:bg-transparent hover:text-indigo-600 active:text-indigo-500" 
                      : "border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white active:bg-indigo-500"}
      ${isActive ? "bg-indigo-600 text-white" : ""}`} 
      href={href}
    >
      {title}
    </a>
  );
};

export default Buttom;
