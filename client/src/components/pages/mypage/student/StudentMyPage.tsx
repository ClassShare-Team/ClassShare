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

// useUser 훅에서 반환되는 user 객체의 타입을 정의합니다.
// 실제 백엔드 응답 또는 UserContext 정의에 맞춰 이 인터페이스를 구성해야 합니다.
interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin'; // 사용자 역할 타입을 명확히 정의
  phone?: string;
  profile_image?: string;
  // 다른 사용자 관련 필드가 있다면 여기에 추가합니다.
}

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
  // setActiveMenu는 현재 사용되지 않으므로, _setActiveMenu로 이름을 변경하여
  // ESLint의 'no-unused-vars' 경고를 비활성화하지 않고 해결할 수 있습니다.
  const [, _setActiveMenu] = useState<string>(''); // 타입 명시

  // useUser 훅이 반환하는 객체에 User 타입을 적용합니다.
  const { user } = useUser() as {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  };

  // 🚨 중요: Hook은 조건부로 호출될 수 없습니다.
  // user 유무 및 역할 검사는 컴포넌트 렌더링 로직의 최상단에서 해야 합니다.
  // 그러나 'return' 문 앞에 Hook을 배치해야 합니다.

  // 훅들을 먼저 호출합니다.
  // user 객체의 초기 상태에 따라 useEffect는 이미 호출된 후
  // 아래 조건부 return 문이 실행될 것입니다.
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments[pathSegments.length - 1];
    _setActiveMenu(currentPath || 'settings');
  }, [location.pathname]);

  // user가 없거나 권한이 없는 경우의 조건부 리다이렉션은 훅 호출 이후에 위치해야 합니다.
  if (!user) {
    toast.info('로그인이 필요합니다.');
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'student') {
    toast.error('학생 마이페이지 접근 권한이 없습니다.');
    return <Navigate to="/" replace />;
  }

  // 현재 사용되지 않지만 추후 확장을 위해 유지
  // ESLint 규칙을 무시하는 대신, 필요 없는 변수는 _로 시작하는 convention을 사용하거나
  // 주석을 제거하여 사용하지 않음을 명확히 할 수 있습니다.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const menuItems: { name: string; path: string }[] = [
    // menuItems 배열에 타입 명시
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
          {/* 와일드카드 경로에 element prop을 사용하여 컴포넌트 전달 */}
          <Route path="*" element={<div>학생 마이페이지 내에서 페이지를 찾을 수 없습니다.</div>} />
        </Routes>
      </MainContent>
    </MyPageLayout>
  );
};

export default StudentMyPage;
