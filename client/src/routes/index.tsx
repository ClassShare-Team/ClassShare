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
import LectureApplyPage from '@/components/pages/lectureApply';
import InstructorInfoPage from '@/components/pages/instructorInfo';
import SearchPage from '@/components/pages/search';
import PointPage from '@/components/pages/point';

import StudentMyCourses from '@/components/pages/mypage/student/myCourses';
import StudentMyPage from '@/components/pages/mypage/student/myPage';
import StudentMyReviews from '@/components/pages/mypage/student/myReviews';
import StudentSettings from '@/components/pages/mypage/student/settings';

import InstructorLecture from '@/components/pages/mypage/instructor/myLecture';
import InstructorMyPage from '@/components/pages/mypage/instructor/myPage';
import InstructorMyStudent from '@/components/pages/mypage/instructor/myStudent';
import InstructorSettings from '@/components/pages/mypage/instructor/settings';
import InstructorProfile from '@/components/pages/instructorProfile';

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
        <Route path="boards/edit/:id" element={<BoardCreatePage />} />
        <Route path="streamingpage/:lectureId" element={<StreamingPage />} />
        <Route path="lectures/:id/apply" element={<LectureApplyPage />} />
        <Route path="instructor-info" element={<InstructorInfoPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="points" element={<PointPage />} />

        <Route path="student/mycourse" element={<StudentMyCourses />} />
        <Route path="student/mypage" element={<StudentMyPage />} />
        <Route path="student/myreview" element={<StudentMyReviews />} />
        <Route path="student/setting" element={<StudentSettings />} />

        <Route path="instructor/mylecture" element={<InstructorLecture />} />
        <Route path="instructor/mypage" element={<InstructorMyPage />} />
        <Route path="instructor/mystudent" element={<InstructorMyStudent />} />
        <Route path="instructor/setting" element={<InstructorSettings />} />
        <Route path="instructor/:instructorId/profile" element={<InstructorProfile />} />
      </Route>
    </Routes>
  );
};
