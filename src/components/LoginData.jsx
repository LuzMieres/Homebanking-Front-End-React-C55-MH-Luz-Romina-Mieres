import { useDispatch } from 'react-redux';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'sweetalert2/dist/sweetalert2.min.css';
import Swal from 'sweetalert2';
import axios from 'axios';

function LoginData() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState([]); // Lista de errores de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validación de la contraseña
  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (!/[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]/.test(password)) {
      errors.push("Password must contain at least one special character.");
    }

    return errors;
  };

  // Validación en tiempo real para la contraseña
  useEffect(() => {
    setPasswordErrors(validatePassword(password));
  }, [password]);

  const alertError = (msg) => {
    Swal.fire({
      title: "Login Error",
      text: msg,
      icon: "error",
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Realizar la petición al backend sin importar las validaciones previas
    const user = { email, password };

    try {
      const res = await axios.post(
        "https://homebanking-back-luz-mieres-c55-mh.onrender.com/api/auth/login",
        user,
        {
          headers: {
            'Content-Type': 'application/json' // Asegúrate de enviar el encabezado correcto
          }
        }
      );
      
      // Guardar el token en localStorage
      if (res.data) {
        localStorage.setItem("token", res.data);
        console.log("Token stored:", res.data);

        // Mostrar SweetAlert de éxito
        Swal.fire({
          title: "Login Successful",
          text: "Redirecting to your account...",
          icon: "success",
          timer: 3000, // 3 segundos
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => {
          // Redirigir después de que el tiempo del SweetAlert haya terminado
          dispatch(loadCurrentUserAction());
          navigate("/accounts/");
        });
      } else {
        alertError("Login failed: No token received");
      }
    } catch (err) {
      console.error("Error during login:", err);

      if (err.response) {
        const statusCode = err.response.status;
        const errorMessage = err.response.data;

        // Manejar errores específicos del backend
        if (statusCode === 403 || statusCode === 401) {
          if (errorMessage === "Email not registered") {
            alertError("The user is not registered.");
          } else if (errorMessage === "Incorrect password") {
            alertError("Incorrect password.");
          } else {
            // Mostrar el mensaje exacto recibido del backend si es distinto
            alertError("Invalid credentials. Please check your username and password.");
          }
        } else {
          // Mostrar el mensaje exacto recibido del backend si es distinto
          alertError("Unexpected error. Please try again later.");
        }
      } else {
        // Si no hay respuesta del backend, mostrar un mensaje genérico de error
        alertError("An error occurred during login. Please try again later.");
      }
    }
  };

  // Verificar si el formulario de login es válido
  const isFormValid = email && password && !errors.email && passwordErrors.length === 0;

  return (
    <div className='flex flex-col sm:flex-row justify-center items-center w-full min-h-screen'>
      <img className='w-full sm:w-[50vw] h-[50vh] sm:h-full object-cover' src="login.png" alt="login" />
      <form onSubmit={handleLogin} className='flex flex-col items-center p-4 gap-[1rem] w-full sm:w-[50vw] h-[50vh] sm:h-full bg-white'>
        <div className='flex justify-center items-center'>
          <img className='h-[3.5rem] w-[11rem]' src="nombreBanco.png" alt="name of bank image" />
          <img className='w-[3.5rem] h-[3.5rem] sm:w-12 sm:h-12' src="bank-icon.svg" alt="banking-icon" />
        </div>
        <div className='w-full'>
          <div className='mb-4'>
            <p className='text-gray-700 text-lg sm:text-2xl'>Email</p>
            <label htmlFor="email">
              <input
                className={`w-full bg-gray-200 text-black text-lg sm:text-2xl p-2 rounded ${errors.email ? 'border border-red-500' : ''}`}
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className='mb-4'>
            <label htmlFor="password">
              <p className='text-gray-700 text-lg sm:text-2xl'>Password</p>
              <div className='relative'>
                <input
                  className={`w-full bg-gray-200 text-black text-lg sm:text-2xl p-2 rounded ${passwordErrors.length > 0 ? 'border border-red-500' : ''}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-2 top-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? "https://img.icons8.com/?size=100&id=14744&format=png&color=000000" : "https://img.icons8.com/?size=100&id=13758&format=png&color=000000"}
                    alt={showPassword ? "Hide password" : "Show password"}
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </label>
            {passwordErrors.length > 0 && (
              <ul className="text-red-500 text-sm mt-1 list-disc ml-5">
                {passwordErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className='flex flex-col justify-center items-center gap-2'>
          <button
            type="submit"
            className={`w-full p-2 rounded text-white ${isFormValid ? 'bg-blue-800 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
            disabled={!isFormValid}
          >
            Login
          </button>
          <p className='text-gray-700 text-lg sm:text-xl'>O</p>
          <Link className='text-lg sm:text-[25px] text-blue-800 hover:text-blue-600' to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default LoginData;
