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
import BoardPage from '@/components/pages/board';
import BoardCreatePage from '@/components/pages/boardCreate';
import VideoListPage from '@/components/pages/VideoListPage';
import BoardPostDetailPage from '@/components/pages/boardPostDetail';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="lecturepage" element={<CreateLecturePage />} />
        <Route path="token" element={<TokenPage />} />
        <Route path="oauth/finalize" element={<OAuthFinalizePage />} />
        <Route path="verifyEmail" element={<VerifyEmailPage />} />
        <Route path="boards" element={<BoardPage />} />
        <Route path="boards/create" element={<BoardCreatePage />} />
        <Route path="lecture/:lectureId/videos" element={<VideoListPage />} />
        <Route path="boards/posts/:id" element={<BoardPostDetailPage />} />
      </Route>
      <Route path="/streamingpage" element={<StreamingPage />} />
    </Routes>
  );
};
