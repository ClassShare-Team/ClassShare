import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Notification } from '@/components/layout/Notification';

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Notification />
      <Footer />
    </>
  );
};

export default App;
