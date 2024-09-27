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
  const [showPassword, setShowPassword] = useState(false); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validación de la contraseña
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;
    if (!regex.test(password)) {
      return "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
    }
    return null;
  };

  const alertError = (msg) => {
    Swal.fire({
      title: "Oops! Something Went Wrong",
      text: msg,
      icon: "error",
    });
  };

  const alertSuccess = (msg) => {
    Swal.fire({
      title: "Success",
      text: msg,
      icon: "success",
    });
  };

  // Validación en tiempo real para el formulario de login
  useEffect(() => {
    const emailError = email === "" ? "Email is required." : null;
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });
  }, [email, password]);

  // Cargar datos de login si existen en localStorage
  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('loginData'));
    if (loginData) {
      setEmail(loginData.email);
      setPassword(loginData.password);
      localStorage.removeItem('loginData'); // Limpiar los datos después de usarlos
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (errors.email || errors.password) {
      alertError("Please fix the errors before submitting.");
      return;
    }

    const user = { email, password };

    try {
      const res = await axios.post("https://homebanking-c55-mh-java-luz-romina-mieres.onrender.com/api/auth/login", user);
      // Guardar el token en localStorage
      if (res.data) {
        localStorage.setItem("token", res.data);
        console.log("Token stored:", res.data);

        // Mostrar SweetAlert de éxito
        Swal.fire({
          title: "Login Successful",
          text: "Redirecting to your account...",
          icon: "success",
          timer: 5000, // 5 segundos
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
        alertError(err.response.data);
      } else {
        alertError("An error occurred during login.");
      }
    }
  };

  // Verificar si el formulario de login es válido
  const isFormValid = email && password && !errors.email && !errors.password;

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
                  className={`w-full bg-gray-200 text-black text-lg sm:text-2xl p-2 rounded ${errors.password ? 'border border-red-500' : ''}`}
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
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
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
          {/* Botón para mostrar el formulario de cambio de contraseña */}
          <button
            type="button"
            onClick={() => setShowChangePasswordForm(!showChangePasswordForm)}
            className="text-lg sm:text-[20px] text-blue-800 hover:text-blue-600"
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginData;
