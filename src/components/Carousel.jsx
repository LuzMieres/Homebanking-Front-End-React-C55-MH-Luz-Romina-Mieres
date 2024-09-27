import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const images = [
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Rio_de_Janeiro_banner_1.jpg',
    'https://www.mojacar.es/wp-content/uploads/2016/12/cala-bordenares-mojacar-turismo-vacaciones-virgen-protegida.jpg',
    'https://www.mixhotels.com/dms/multiHotel-Mix-Hotels/mix-slide-hoteles/elarenal-mallorca.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Cambia la imagen cada 3 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [images.length]);

  return (
    <div className="relative w-full h-[200px]  lg:h-[400px] overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute  w-full h-full transition-opacity duration-1000  ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default Carousel;
