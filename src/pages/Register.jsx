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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // // Solo validar contraseñas si ambas están ingresadas
    // if (name === "password" || name === "confirmPassword") {
    //   validatePasswords();
    // }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      formData.password == formData.confirmPassword &&
      formData.password !== "" &&
      formData.email !== "" &&
      formData.firstName !== "" &&
      formData.lastName !== ""
    ) {
      console.log(formData);
      console.log("Submit");
      formData.email = formData.email.toLowerCase();
      sendPutRequest(formData);
    } else {
      alert("Complete todos los campos");
    }
  };

  const sendPutRequest = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response.data);
      navigate("/login");
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex items-end h-32 bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="/public/bank3.jpeg"
            className="absolute inset-0 object-cover w-full h-full opacity-80"
          />
          <div className="hidden lg:relative lg:block lg:p-12">
            <img
              src="/public/unnamed.jpeg"
              alt=""
              className="w-20 rounded-full"
            />
            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to QuantumBank
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">
              Sign up to access your online bank account. Create your profile,
              set up your security credentials, and start managing your finances
              with full control and convenience from anywhere.
            </p>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative block -mt-16 lg:hidden">
              <img
                src="/public/unnamed.jpeg"
                alt=""
                className="w-20 rounded-full"
              />
              <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                Welcome to QuantumBank
              </h1>
              <p className="mt-4 leading-relaxed text-gray-500">
                Sign up to access your online bank account. Create your profile,
                set up your security credentials, and start managing your
                finances with full control and convenience from anywhere.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-96">
              <h2 className="text-5xl text-center">Sign up</h2>
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
              {!passwordMatch === false && (
                <p className="text-red-500">Las contraseñas no coinciden</p>
              )}
              <button
                type="submit"
                className="inline-block w-full px-5 py-3 font-medium text-white bg-black rounded-lg sm:w-auto"
              >
                Sign up
              </button>
              <Link to="/login">
                <Button title="Log in" />
              </Link>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Register;
