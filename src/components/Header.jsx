import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'; // Importar el CSS de SweetAlert2
import '../styles/style.css';

function Header() {
  const [showNav, setShowNav] = useState(false);
  const navigate = useNavigate();

  // Función para manejar el logout con confirmación
  function handleLogout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to log out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33', // Color del botón de confirmación (rojo)
      cancelButtonColor: '#3085d6', // Color del botón de cancelación (azul)
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'No, stay',
    }).then((result) => {
      if (result.isConfirmed) {
        // Acciones para cerrar sesión
        localStorage.removeItem('token');
        navigate('/');
        Swal.fire({
          title: 'Logged Out',
          text: 'You have successfully logged out.',
          icon: 'success',
          timer: 2000, // Mostrar por 2 segundos antes de redirigir
          showConfirmButton: false,
        });
      }
    });
  }

  // Función para alternar la visibilidad del menú en pantallas pequeñas
  const toggleNav = () => {
    setShowNav(!showNav);
  };

  return (
    <>
      <header className='header'>
        <div className='header-title'>
          <h1 className='header-title-text'>BigBank</h1>
        </div>
        {/* Botón del menú para pantallas pequeñas */}
        <button
          id="menu"
          onClick={toggleNav}
          className='menu-button'
        >
          {showNav ? "X" : "≡"}
        </button>
      </header>

      {/* Navegación, mostrar u ocultar basado en el estado showNav */}
      <nav className={`nav ${showNav ? 'show' : ''}`}>
        <ul className='nav-links gap-2 md:gap-3 lg:gap-5 xl:gap-10 2xl:gap-10'>
          <button
            onClick={() => navigate(-1)}
            className="back-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff">
              <path d="m313-440 196 196q12 12 11.5 28T508-188q-12 11-28 11.5T452-188L188-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l264-264q11-11 27.5-11t28.5 11q12 12 12 28.5T508-715L313-520h447q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H313Z" />
            </svg>
          </button>
          <li>
            <NavLink
              to='/accounts'
              className={({ isActive }) => isActive ? "active-link" : "nav-link"}
            >
              Accounts
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/newTransaction'
              className={({ isActive }) => isActive ? "active-link" : "nav-link"}
            >
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/cards'
              className={({ isActive }) => isActive ? "active-link" : "nav-link"}
            >
              Cards
            </NavLink>
          </li>
          <li>
            <NavLink
              to='/loans'
              className={({ isActive }) => isActive ? "active-link" : "nav-link"}
            >
              Loans
            </NavLink>
          </li>
        </ul>
        {/* Añadir una clase wrapper y mover el botón de logout fuera de la lista de navegación */}
        <div className="logout-wrapper">
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="RGB(255 255 255)">
              <path d="M806-440H360q-17 0-28.5-11.5T320-480q0-17 11.5-28.5T360-520h446l-34-34q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T829-611l103 103q12 12 12 28t-12 28L829-349q-12 12-28.5 11.5T772-350q-11-12-11.5-28t11.5-28l34-34ZM600-640v-120H200v560h400v-120q0-17 11.5-28.5T640-360q17 0 28.5 11.5T680-320v120q0 33-23.5 56.5T600-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h400q33 0 56.5 23.5T680-760v120q0 17-11.5 28.5T640-600q-17 0-28.5-11.5T600-640Z" />
            </svg>
          </button>
        </div>
      </nav>

    </>
  );
}

export default Header;
