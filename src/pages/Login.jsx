import React from 'react';
import LoginData from '../components/LoginData';
import '../styles/style.css';

function Login() {
  return (
    <div className='flex flex-col justify-center items-center w-full min-h-screen sm:w-full divLoginLaptop xl:flex xl:flex-col xl:items-center xl:justify-center xl:w-screen'>
      <LoginData />
    </div>
  );
}

export default Login;