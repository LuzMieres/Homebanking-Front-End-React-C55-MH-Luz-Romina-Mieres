import React from 'react';
import Header from '../components/Header';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import { loadCurrentUserAction } from '../redux/actions/loadCurrentUserAction';

function MainLayout() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.currentUser);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadCurrentUserAction());
    }
  }, [dispatch, status]);
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
