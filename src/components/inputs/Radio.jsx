import React, { useState } from "react";

const Radio = (props) => {
  // Mantén el estado de la opción seleccionada
  const [selectedOption, setSelectedOption] = useState("");
  

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <fieldset className="flex flex-wrap gap-6 justify-center items-center text-5xl">
      {props.options.map((option) => (
        <div key={option}>
          <label
            htmlFor={option}
            className={`flex cursor-pointer items-center justify-center rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-900 hover:border-gray-200
            ${selectedOption === option ? "border-blue-500 bg-blue-300 text-white" : ""}`}
          >
            <input
            
              type="radio"
              name="ColorOption"
              value={option}
              id={option}
              className="sr-only"
              checked={selectedOption === option}
              onClick={handleChange}
              onChange={props.onChange}
            />
            <p className="text-sm font-medium">{option}</p>
          </label>

        </div>
      ))}
    </fieldset>
  );
};

export default Radio;


