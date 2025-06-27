import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from 'react-toastify';
// import { Notification } from '@/components/layout/Notification';

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
      {/* <Notification /> */}
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        aria-label="알림"
      />
    </>
  );
};

export default App;
