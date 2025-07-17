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
import LecturePage from '@/components/pages/lectureApply';
import InstructorInfoPage from '@/components/pages/instructorInfo';

// ✅ 마이페이지 관련 컴포넌트 임포트 (기존 학생용)
import StudentMyPage from '@/components/pages/mypage/student/StudentMyPage';
import Settings from '@/components/pages/mypage/student/Settings'; // Student Settings (Settings.tsx는 학생용 폴더에 있으므로 StudentSettings로 임시 명명)
import MyCourses from '@/components/pages/mypage/student/MyCourses';
import MyReviews from '@/components/pages/mypage/student/MyReviews';
import PaymentHistory from '@/components/pages/mypage/student/PaymentHistory';
import Inquiry from '@/components/pages/mypage/student/Inquiry'; // Student Inquiry

// ✅ 강사용 마이페이지 관련 컴포넌트 임포트 (추가)
import InstructorMyPage from '@/components/pages/mypage/instructor/InstructorMyPage';
// 강사용 Settings와 Inquiry는 학생용과 코드는 동일하지만, 파일을 분리했으므로 별도로 임포트합니다.
import InstructorSettings from '@/components/pages/mypage/instructor/Settings';
import InstructorInquiry from '@/components/pages/mypage/instructor/Inquiry';
// TODO: 아래 컴포넌트들은 아직 구현되지 않았으므로 임시로 div로 대체합니다.
// 실제 컴포넌트 파일이 생기면 이 주석을 해제하고 임포트하세요.
// import InstructorMyLectures from '@/components/pages/mypage/instructor/MyLectures';
// import InstructorRevenueStatistics from '@/components/pages/mypage/instructor/RevenueStatistics';

// ✅ 사용자 인증 관련 Context 임포트
import { useUser } from '@/contexts/UserContext';

export const AppRoutes = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>사용자 데이터를 불러오는 중입니다...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<App />}>
        {/* 기존 라우트들은 이 위치에 그대로 유지됩니다. */}
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
        <Route path="streamingpage" element={<StreamingPage />} />
        <Route path="lectures/:id/apply" element={<LecturePage />} />
        <Route path="instructor-info" element={<InstructorInfoPage />} />

        {/* --- ✅ 마이페이지 라우팅 추가 시작 (맨 아래 배치) --- */}
        {/*
          'mypage' 기본 경로 진입 시 사용자 역할에 따라 리다이렉트 처리.
          user가 null이면 로그인 페이지로, 학생이면 학생 마이페이지 설정으로,
          강사이면 강사 마이페이지(my-lectures)로 리다이렉트합니다.
        */}
        <Route
          path="mypage"
          element={
            user ? (
              user.role === 'student' ? (
                <Navigate to="/mypage/student/settings" replace />
              ) : user.role === 'instructor' ? (
                <Navigate to="/mypage/instructor/my-lectures" replace />
              ) : (
                // 정의되지 않은 역할의 사용자 (예: admin) 또는 기타
                <Navigate to="/" replace />
              )
            ) : (
              // 사용자가 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
              <Navigate to="/login" replace />
            )
          }
        />

        {/* 학생 마이페이지 라우트 그룹 */}
        {user && user.role === 'student' ? (
          <Route path="mypage/student" element={<StudentMyPage />}>
            <Route index element={<Navigate to="settings" replace />} />
            <Route path="settings" element={<Settings />} /> {/* 학생용 Settings */}
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="my-reviews" element={<MyReviews />} />
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="inquiry" element={<Inquiry />} /> {/* 학생용 Inquiry */}
            <Route
              path="*"
              element={<div>학생 마이페이지 내에서 페이지를 찾을 수 없습니다.</div>}
            />
          </Route>
        ) : (
          <Route path="mypage/student/*" element={<Navigate to="/login" replace />} />
        )}

        {/* ✅ 강사 마이페이지 라우트 그룹 (새로 추가) */}
        {user && user.role === 'instructor' ? (
          <Route path="mypage/instructor" element={<InstructorMyPage />}>
            <Route index element={<Navigate to="my-lectures" replace />} /> {/* 강사 기본 경로 */}
            <Route path="settings" element={<Settings />} />
            <Route path="inquiry" element={<Inquiry />} />
            {/* TODO: 여기에 실제 강사 전용 컴포넌트를 연결하세요. */}
            <Route path="my-lectures" element={<div>내 강의 관리 페이지 (구현 예정)</div>} />
            <Route path="revenue-statistics" element={<div>매출 통계 페이지 (구현 예정)</div>} />
            <Route
              path="*"
              element={<div>강사 마이페이지 내에서 페이지를 찾을 수 없습니다.</div>}
            />
          </Route>
        ) : (
          <Route path="mypage/instructor/*" element={<Navigate to="/login" replace />} />
        )}
        {/* --- ✅ 마이페이지 라우팅 추가 끝 --- */}
      </Route>

      {/* App 레이아웃 바깥의 404 라우트 */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};
