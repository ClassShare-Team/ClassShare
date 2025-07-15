import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 최상위 레이아웃 컴포넌트입니다. 이 컴포넌트 내부에 <Outlet />이 있어야 합니다.
import App from '@/App';

// 각 페이지 컴포넌트 임포트
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

// 마이페이지 컴포넌트 임포트 (StudentMyPage는 이제 레이아웃 역할만 수행합니다)
import StudentMyPage from '@/components/pages/mypage/student/StudentMyPage';
// import InstructorMyPage from '@/components/pages/mypage/instructor/InstructorMyPage';
// import AdminMyPage from '@/components/pages/mypage/admin/AdminMyPage';

// ⭐ 마이페이지 하위 컴포넌트 임포트 (그대로 유지) ⭐
import Settings from '@/components/pages/mypage/student/Settings';
import MyCourses from '@/components/pages/mypage/student/MyCourses';
import MyReviews from '@/components/pages/mypage/student/MyReviews';
import PaymentHistory from '@/components/pages/mypage/student/PaymentHistory';
import Inquiry from '@/components/pages/mypage/student/Inquiry';

// 사용자 컨텍스트 (로그인 상태 및 역할 확인용)
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

        {/* 1-5. 마이페이지 진입점 라우트: /mypage 로 접근 시 사용자 역할에 따라 리다이렉트 (이 부분은 유지) */}
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

        {/* ⭐ 핵심 변경: 학생 마이페이지 라우트 구조 변경 ⭐ */}
        {user && user.role === 'student' ? (
          <Route path="mypage/student" element={<StudentMyPage />}>
            {/* 🚨 StudentMyPage는 이제 레이아웃이므로, 그 자식으로 하위 컴포넌트를 정의합니다. */}
            {/* '/mypage/student' 경로로 접근 시 기본으로 'settings'를 보여줍니다. */}
            <Route index element={<Navigate to="settings" replace />} />
            <Route path="settings" element={<Settings />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-reviews" element={<MyReviews />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="inquiry" element={<Inquiry />} />
            {/* 기타 /mypage/student/ 하위의 매칭되지 않는 경로에 대한 처리 (예: 404) */}
            <Route
              path="*"
              element={<div>학생 마이페이지 내에서 페이지를 찾을 수 없습니다.</div>}
            />
          </Route>
        ) : (
          // 로그인하지 않았거나 학생이 아닌 경우 /mypage/student/* 접근 시 리다이렉트
          <Route path="mypage/student/*" element={<Navigate to="/login" replace />} />
        )}

        {/* 강사/관리자 마이페이지 라우트 (필요 시 위와 같은 중첩 라우트 형태로 구현) */}
        {/* {user && user.role === 'instructor' && (
          <Route path="mypage/instructor" element={<InstructorMyPage />}>
            <Route index element={<Navigate to="my-lectures" replace />} />
            <Route path="my-lectures" element={<div>강사 강의 관리</div>} />
          </Route>
        )}
        {user && user.role === 'admin' && (
          <Route path="mypage/admin" element={<AdminMyPage />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<div>관리자 대시보드</div>} />
          </Route>
        )} */}
      </Route>{' '}
      {/* App 컴포넌트의 자식 라우트 그룹 종료 */}
      {/* App 컴포넌트의 레이아웃을 사용하지 않는 독립적인 라우트들 */}
      <Route path="/streamingpage" element={<StreamingPage />} />
      {/* 404 Not Found 페이지: 모든 매칭되지 않는 경로를 처리합니다. */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
