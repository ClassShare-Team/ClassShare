import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '@/App';
import { RegisterPage } from '@/components/pages/register';
import { LoginPage } from '@/components/pages/login';
import { MainPage } from '@/components/pages/main';
import CreateLecturePage from '@/components/pages/lecture';
import TokenPage from '@/components/pages/token'; // ★ 이 줄 추가

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="lecturepage" element={<CreateLecturePage />} />
        <Route path="token" element={<TokenPage />} /> {/* ★ 이 줄 추가 */}
      </Route>
    </Routes>
  );
};
