import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from '@/App';
import RegisterPage from '@/components/pages/register';
import { LoginPage } from '@/components/pages/login';
import MainPage from '@/components/pages/main';
import CreateLecturePage from '@/components/pages/lecture';
import TokenPage from '@/components/pages/token';
import { OAuthFinalizePage } from '@/components/pages/oauth/finalize';
import VerifyEmailPage from '@/components/pages/verifyEmail';
import StreamingPage from '@/components/pages/streamingpage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* App 레이아웃 아래에 들어가는 기존 라우트들 */}
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="lecturepage" element={<CreateLecturePage />} />
        <Route path="token" element={<TokenPage />} />
        <Route path="oauth/finalize" element={<OAuthFinalizePage />} />
        <Route path="verifyEmail" element={<VerifyEmailPage />} />
      </Route>
      {/* layout(App) 없이, 단독으로 streamingpage 라우트 */}
      <Route path="/streamingpage" element={<StreamingPage />} />
    </Routes>
  );
};
