import React, { useState, useEffect } from 'react';
import '../styles/style.css';

const Carrousel = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    'banner.jpg',
    'homebanking-banner2.jpg',
    'homebanking-banner3.jpg',
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia de imagen cada 5 segundos
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="carousel w-full h-[30vh] flex items-center justify-center relative">
      {images.map((image, index) => (
        <img 
          key={index}
          src={image}
          alt={`Imagen ${index}`}
          className={`carousel-image w-full h-[30vh] object-cover ${index === currentImageIndex ? 'visible' : 'hidden'}`}
        />
      ))}
    </div>
  );
};

export default Carrousel;
