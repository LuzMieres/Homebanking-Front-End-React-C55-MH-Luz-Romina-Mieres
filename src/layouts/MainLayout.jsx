import React from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import '../styles/style.css';
import Footer from '../components/Footer';

function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> 
      <main className="flex-grow w-full"> 
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
