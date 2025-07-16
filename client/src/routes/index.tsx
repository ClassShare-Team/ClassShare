import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
// import LecturePage from '@/components/pages/lectureApply';
import InstructorInfoPage from '@/components/pages/instructorInfo';

// ✅ 학생 마이페이지 관련 컴포넌트
import StudentMyPage from '@/components/pages/mypage/student/StudentMyPage';
import Settings from '@/components/pages/mypage/student/Settings';
import MyCourses from '@/components/pages/mypage/student/MyCourses';
import MyReviews from '@/components/pages/mypage/student/MyReviews';
import PaymentHistory from '@/components/pages/mypage/student/PaymentHistory';
import Inquiry from '@/components/pages/mypage/student/Inquiry';

// ✅ 사용자 인증 관련 Context
import { useUser } from '@/contexts/UserContext';

export const AppRoutes = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="main" element={<MainPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="token" element={<TokenPage />} />
        <Route path="oauth/finalize" element={<OAuthFinalizePage />} />
        <Route path="verifyEmail" element={<VerifyEmailPage />} />
        <Route path="lecturepage" element={<CreateLecturePage />} />
        <Route path="lecture/:lectureId/videos" element={<VideoListPage />} />
        <Route path="boards" element={<BoardPage />} />
        <Route path="boards/create" element={<BoardCreatePage />} />
        <Route path="boards/posts/:id" element={<BoardPostDetailPage />} />

        {/* ✅ 내가 작성한 마이페이지 라우팅 추가 시작 */}
        <Route
          path="mypage"
          element={
            user ? (
              user.role === 'student' ? (
                <Navigate to="/mypage/student/settings" replace />
              ) : user.role === 'instructor' ? (
                <Navigate to="/mypage/instructor/my-lectures" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {user && user.role === 'student' ? (
          <Route path="mypage/student" element={<StudentMyPage />}>
            <Route index element={<Navigate to="settings" replace />} />
            <Route path="settings" element={<Settings />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-reviews" element={<MyReviews />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="inquiry" element={<Inquiry />} />
            <Route
              path="*"
              element={<div>학생 마이페이지 내에서 페이지를 찾을 수 없습니다.</div>}
            />
          </Route>
        ) : (
          <Route path="mypage/student/*" element={<Navigate to="/login" replace />} />
        )}
        {/* ✅ 내가 작성한 마이페이지 라우팅 추가 끝 */}

        {/* 👉 아래 두 개는 dev/frontend 쪽에서만 있던 라우팅 (추가됨) */}
        <Route path="streamingpage" element={<StreamingPage />} />
        {/* <Route path="applypage" element={<LecturePage />} /> */}
        <Route path="instructor-info" element={<InstructorInfoPage />} />
      </Route>

      {/* 👉 App 레이아웃 바깥의 라우트들 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
