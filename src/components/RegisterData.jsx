import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import '../styles/style.css';

export const registerArray = [];

function RegisterData() {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Validación de la contraseña
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    if (!regex.test(password)) {
      return "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
    }
    return null;
  };

  function validateField(name, value) {
    let error = '';
    if (!value) {
      error = `${name} cannot be empty.`; // Mensaje de error si el campo está vacío
    } else if (/^\s/.test(value)) {
      error = `${name} cannot start with spaces.`;
    } else if (name === 'name' || name === 'lastName') { // Verifica si el nombre es 'lastName'
      if (!/^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/.test(value)) {
        error = `${name} cannot contain numbers or special characters.`;
      }
    } else if (name === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Email is invalid.';
      }
    } else if (name === 'password') {
      const passwordError = validatePassword(value);
      if (passwordError) error = passwordError;
    }

    setError(prevErrors => ({
      ...prevErrors,
      [name]: error, // Cambio de [name.toLowerCase()] a [name] para asegurar que el error se asigne correctamente.
    }));

    return error === '';
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    // Trim only when there's an error about leading spaces
    if (error[name]?.includes('spaces')) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value.trimStart(),
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }

    validateField(name, value);
  }

  function validateForm() {
    const { name, lastName, email, password } = formData;
    const isNameValid = validateField('name', name);
    const isLastNameValid = validateField('lastName', lastName); // Asegúrate de pasar 'lastName' aquí
    const isEmailValid = validateField('email', email);
    const isPasswordValid = validateField('password', password);

    return isNameValid && isLastNameValid && isEmailValid && isPasswordValid;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    axios.post("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/auth/register", {
      firstName: formData.name,
      lastName: formData.lastName, // Cambio de lastName para asegurar que se pase correctamente
      email: formData.email,
      password: formData.password,
    })
      .then(response => {
        registerArray.push(response.data.account);
        // Guardar los datos de inicio de sesión en localStorage para que LoginData los utilice
        localStorage.setItem('loginData', JSON.stringify({ email: formData.email, password: formData.password }));
        Swal.fire({
          icon: 'success',
          title: 'Account Created Successfully',
          text: 'Would you like to log in now?',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/'); // Redirigir a la página de inicio de sesión
          } else {
            navigate('/home');
          }
        });
      })
      .catch(error => {
        console.error("There was a problem with the request:", error);
        setError({ form: 'There was a problem creating your account.' });
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a problem creating your account.',
        });
      });
  }

  // Validación de formulario en tiempo real
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Verificar si el formulario es válido
  const isFormValid = formData.name && formData.lastName && formData.email && formData.password && !error.name && !error.lastName && !error.email && !error.password;

  return (
    <div className='flex flex-col sm:flex-row justify-center items-center w-full min-h-screen'>
      <img className='w-full sm:w-[50vw] h-[50vh] sm:h-full object-cover' src="login.png" alt="register" />
      <form onSubmit={handleSubmit} className='flex flex-col items-center p-4 gap-[1rem] w-full sm:w-[50vw] h-[50vh] sm:h-full bg-white'>
        <div className='flex justify-center items-center'>
          <img className='h-[3.5rem] w-[11rem]' src="nombreBanco.png" alt="name of bank image" />
          <img className='w-[3.5rem] h-[3.5rem] sm:w-12 sm:h-12' src="bank-icon.svg" alt="banking-icon" />
        </div>
        <div className='w-full'>
          <div className='mb-4'>
            <p className='text-gray-700 text-lg sm:text-2xl'>Name</p>
            <label htmlFor="name">
              <input
                className={`w-full bg-gray-200 text-black text-lg sm:text-2xl p-2 rounded ${error?.name ? 'border border-red-500' : ''}`}
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            {error?.name && <p className="text-red-500 text-sm">{error.name}</p>}
          </div>
          <div className='mb-4'>
            <p className='text-gray-700 text-lg sm:text-2xl'>Last Name</p>
            <label htmlFor="lastName">
              <input
                className={`w-full bg-gray-200 text-black text-lg sm:text-2xl p-2 rounded ${error?.lastName ? 'border-red-500' : ''}`} // Cambio a error?.lastName
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </label>
            {error?.lastName && <p className="text-red-500 text-sm">{error.lastName}</p>} {/* Cambio a error?.lastName */}
          </div>
          <div className='mb-4'>
            <p className='text-gray-700 text-lg sm:text-2xl'>Email</p>
            <label htmlFor="email">
              <input
                className={`w-full bg-gray-200 text-black text-lg sm:text-2xl p-2 rounded ${error?.email ? 'border-red-500' : ''}`}
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            {error?.email && <p className="text-red-500 text-sm">{error.email}</p>}
          </div>
          <div className='mb-6'>
            <label htmlFor="password">
              <p className='text-gray-700 text-lg sm:text-2xl'>Password</p>
              <div className='relative'>
                <input
                  className={`w-full bg-gray-200 text-black text-lg sm:text-2xl p-2 rounded ${error?.password ? 'border-red-500' : ''}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <img
                      src="https://img.icons8.com/?size=100&id=14744&format=png&color=000000"
                      alt="Hide password"
                      className="w-6 h-6"
                    />
                  ) : (
                    <img
                      src="https://img.icons8.com/?size=100&id=13758&format=png&color=000000"
                      alt="Show password"
                      className="w-6 h-6"
                    />
                  )}
                </button>
              </div>
              {error?.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </label>
          </div>
        </div>
        <div className='flex flex-col items-center justify-center gap-2'>
          <button
            type="submit"
            className={`w-full p-2 rounded text-white ${isFormValid ? 'bg-blue-800 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!isFormValid}
          >
            Register
          </button>
          <p className='text-gray-700 text-lg sm:text-2xl'>O</p>
          <Link className='text-lg sm:text-[25px] text-blue-800 hover:text-blue-600' to="/">Login</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterData;
