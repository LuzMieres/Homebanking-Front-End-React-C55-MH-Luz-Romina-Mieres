import React from 'react';

const InputSelect = (props) => {
  const { name, title, options, onChange } = props;

  return (
    <label htmlFor={name} className="block text-sm font-medium text-gray-900 ">
      <select
        name={name}
        onChange={onChange} // Asegúrate de pasar el onChange aquí
        className="relative w-30 block rounded-md border-2 p-1 border-gray-200 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <option value="" disabled selected hidden>
          {title}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className='text-center'>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export default InputSelect;
