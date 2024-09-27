import React, { useState } from "react";

const validatePassword = (password) => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isValidLength = password.length >= 8;

  const errors = [];
  if (!hasUpperCase) errors.push("Debe contener al menos una mayúscula.");
  if (!hasLowerCase) errors.push("Debe contener al menos una minúscula.");
  if (!hasNumber) errors.push("Debe contener al menos un número.");
  if (!hasSpecialChar) errors.push("Debe contener al menos un símbolo.");
  if (!isValidLength) errors.push("Debe tener al menos 8 caracteres.");

  return errors;
};

const PasswordInput = ({ name, title, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    const validationErrors = validatePassword(value);
    
    setErrors(validationErrors);
    setInputValue(value);

    if (onChange) onChange(e);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="relative block rounded-md border-2 p-1 border-gray-200 bg-white shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
      >
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          value={inputValue}
          className="peer w-full border-none bg-transparent placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0"
          placeholder={title}
          onChange={handleChange}
          autoComplete="off"
          style={{ padding: '0.5rem 0.75rem' }}  // Asegura que el padding interno sea suficiente
        />
        <span className="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-[#C4DFFE] px-1 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 
        peer-placeholder-shown:text-lg peer-placeholder-shown:bg-transparent peer-focus:top-0 peer-focus:text-xs peer-focus:bg-[#C4DFFE] rounded">
          {title}
        </span>
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute inset-y-0 end-0 px-3 flex items-center text-sm text-gray-600"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </label>
      {errors.length > 0 && (
        <ul className="mt-1 text-xs text-red-600">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordInput;
