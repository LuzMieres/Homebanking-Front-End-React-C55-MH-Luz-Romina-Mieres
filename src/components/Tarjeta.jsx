import React, { useState } from 'react';
import '../styles/style.css';

const Tarjeta = () => {
  const [isDorso, setIsDorso] = useState(false);

  const handleClick = () => {
    setIsDorso(!isDorso);
  };

  return (
    <div className={`tarjeta ${isDorso ? 'dorso' : ''}`}>
      <div className="background-dorso" style={{ backgroundImage: `url(imagen-dorso.jpg)` }}></div>
    </div>
  );
};

export default Tarjeta;