import { useEffect, useState } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'react-toastify';

import MyCourses from './MyCourses';
import MyReviews from './MyReviews';
import PaymentHistory from './PaymentHistory';
import Inquiry from './Inquiry';
import Settings from './Settings';

const MyPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray100};
  font-family: ${({ theme }) => theme.fontFamily};
  padding: 24px;
  align-items: center;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1200px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  overflow: hidden;
  padding: 40px;
`;

const StudentMyPage = () => {
  const location = useLocation();
  const [, setActiveMenu] = useState('');

  const { user } = useUser();

  if (!user) {
    toast.info('로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'student') {
    toast.error('학생 마이페이지 접근 권한이 없습니다.');
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments[pathSegments.length - 1];
    setActiveMenu(currentPath || 'settings');
  }, [location.pathname]);

  // 현재 사용되지 않지만 추후 확장을 위해 유지
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const menuItems = [
    { name: '나의 강의 관리', path: 'my-courses' },
    { name: '작성한 리뷰', path: 'my-reviews' },
    { name: '결제 내역', path: 'payments' },
    { name: '1:1 문의', path: 'inquiry' },
    { name: '설정', path: 'settings' },
  ];

  return (
    <MyPageLayout>
      <MainContent>
        <Routes>
          <Route index element={<Navigate to="settings" replace />} />
          <Route path="my-courses" element={<MyCourses />} />
          <Route path="my-reviews" element={<MyReviews />} />
          <Route path="payments" element={<PaymentHistory />} />
          <Route path="inquiry" element={<Inquiry />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<div>학생 마이페이지 내에서 페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </MainContent>
    </MyPageLayout>
  );
};

export default StudentMyPage;
