import React, { useState } from "react";
import LabelInput from "../components/LabelInput";
import Button from "../components/Buttom";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/actions/authenticationAction";
import { loadClient } from "../redux/actions/clientAction";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const user = { email, password };
    
    // Determina la URL base de la API según el entorno
    const baseURL = process.env.REACT_APP_ENV === 'production'
      ? process.env.REACT_APP_API_URL_PRODUCTION
      : process.env.REACT_APP_API_URL_DEVELOPMENT;
  
    try {
      const res = await axios.post(`${baseURL}/auth/login`, user);
      localStorage.setItem("token", res.data);
      console.log(res.data);
  
      navigate("/accounts/");
      dispatch(loadClient());
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <section className="bg-white">
      <div className="flex w-full justify-center items-center h-screen lg:grid-cols-12">
        <main className="flex  w-full h-screen items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <img className="w-1/2 h-screen" src="login.png" alt="login image" />
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-1/2 h-screen justify-center">
              <h2 className="text-5xl text-center text-blue-900">Login</h2>
              <LabelInput
                type="email"
                name="email"
                title="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <PasswordInput
                name="password"
                title="Password"
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="inline-block w-full px-5 py-3 font-medium text-white bg-blue-800 rounded-lg"
              >
                Login
              </button>
              
              <Link to="/register">
                <Button href="#" title="Register" />
              </Link>
              <h4 className="text-black text-center hover:text-blue-500">Forgot your password?</h4>
            </form>
        </main>
      </div>
    </section>
  );
};

export default Login;
