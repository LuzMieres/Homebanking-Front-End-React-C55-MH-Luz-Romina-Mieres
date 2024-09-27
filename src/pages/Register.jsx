import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LabelInput from "../components/LabelInput";
import Button from "../components/Buttom";
import PasswordInput from "../components/PasswordInput";
import EmailInput from "../components/EmailInput";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState();
  const navigate = useNavigate();

  // Determinar la URL base de la API según el entorno
  const baseURL =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_API_URL_PRODUCTION
      : process.env.REACT_APP_API_URL_DEVELOPMENT;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validar contraseñas
    if (name === "password" || name === "confirmPassword") {
      setPasswordMatch(
        formData.password === formData.confirmPassword &&
          formData.password !== ""
      );
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      formData.password === formData.confirmPassword &&
      formData.password !== "" &&
      formData.email !== "" &&
      formData.firstName !== "" &&
      formData.lastName !== ""
    ) {
      formData.email = formData.email.toLowerCase();
      sendRegisterRequest(formData);
    } else {
      alert("Please complete all fields correctly.");
    }
  };

  const sendRegisterRequest = async (data) => {
    try {
      // Hacer la solicitud de registro a la API
      const response = await axios.post(`${baseURL}/auth/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response.data);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("There was an error!", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <section className="bg-white">
      <div className="flex w-full justify-center items-center h-screen lg:grid-cols-12">
        <main className="flex w-full h-screen items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <img className="w-1/2 h-screen" src="login.png" alt="login image" />
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-1/2 h-screen justify-center"
          >
            <h2 className="text-5xl text-center text-blue-900">Sign up</h2>
            <LabelInput
              type="text"
              name="firstName"
              title="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <LabelInput
              type="text"
              name="lastName"
              title="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <EmailInput
              name="email"
              title="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <PasswordInput
              name="password"
              title="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <PasswordInput
              name="confirmPassword"
              title="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {passwordMatch === false && (
              <p className="text-red-500">Passwords do not match.</p>
            )}
            <button
              type="submit"
              className="inline-block w-full px-5 py-3 font-medium text-white bg-blue-800 rounded-lg sm:w-auto"
            >
              Sign up
            </button>
            <Link to="/login">
              <Button title="Log in" />
            </Link>
          </form>
        </main>
      </div>
    </section>
  );
};

export default Register;
