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

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",user);
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
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-96">
              <h2 className="text-5xl text-center">Login</h2>
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
                className="inline-block w-full px-5 py-3 font-medium text-white bg-black rounded-lg"
              >
                Enter
              </button>
              <Button href="#" title="Forgot my password" />
              <Link to="/register">
                <Button href="#" title="Register" />
              </Link>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Login;
