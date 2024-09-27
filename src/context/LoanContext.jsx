// context/LoanContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const LoanContext = createContext();

// Crear el proveedor
export const LoanProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState('');

  return (
    <LoanContext.Provider value={{ selectedAccount, setSelectedAccount }}>
      {children}
    </LoanContext.Provider>
  );
};
