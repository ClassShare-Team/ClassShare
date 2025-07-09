import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '@/App';
import { RegisterPage } from '@/components/pages/register';
import { LoginPage } from '@/components/pages/login';
import MainPage from "@/components/pages/main";
import CreateLecturePage from '@/components/pages/CreateLecturePage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
       <Route index element={<MainPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="LecturePage" element={<CreateLecturePage />} />
      </Route>
    </Routes>
  );
};
