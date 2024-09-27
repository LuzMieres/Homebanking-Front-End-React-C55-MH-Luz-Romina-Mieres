import React, { useState } from "react";

const LabelInput = ({ name, title, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (onChange) onChange(e);
  };

  return (
    <label
      htmlFor={name}
      className="relative block rounded-md border-2 p-1 border-gray-200 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      <input
        type="text"
        id={name}
        name={name}
        value={inputValue}
        className="peer w-full  border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
        placeholder={title}
        onChange={handleChange}
        autoComplete="off"
        style={{ padding: '0.5rem 0.75rem' }}
      />
      <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-[#C4DFFE] px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 
      peer-placeholder-shown:text-lg peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:bg-[#C4DFFE] rounded">
        {title}
      </span>
    </label>
  );
};

export default LabelInput;
