import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

// --- Styled Components ---
const MyPageContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 80px); /* 헤더 높이 제외 */
  background-color: ${({ theme }) => theme.colors.gray50};
  padding: 30px 0;
`;

const Sidebar = styled.nav`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  margin-left: 50px;
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarHeader = styled.div`
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  text-align: center;

  h3 {
    ${({ theme }) => theme.fonts.h2};
    font-size: 24px;
    color: ${({ theme }) => theme.colors.black};
    margin-bottom: 8px;
  }

  p {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

const MenuItem = styled.li`
  width: 100%;
  margin-bottom: 8px;

  a {
    display: flex;
    align-items: center;
    padding: 15px 30px;
    color: ${({ theme }) => theme.colors.gray500};
    text-decoration: none;
    font-size: 17px;
    font-weight: 500;
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out;
    border-left: 5px solid transparent;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray100};
      color: ${({ theme }) => theme.colors.purple};
    }

    &.active {
      background-color: ${({ theme }) => theme.colors.gray500};
      color: ${({ theme }) => theme.colors.purple};
      font-weight: 700;
      border-left-color: ${({ theme }) => theme.colors.purple};
    }
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  margin-left: 40px;
  margin-right: 50px;
`;

const InstructorMyPage: React.FC = () => {
  const { user } = useUser(); // UserContext에서 사용자 정보 가져오기
  const navigate = useNavigate();
  const location = useLocation();

  // 강사 역할이 아니면 접근 제한
  useEffect(() => {
    if (user && user.role !== 'instructor') {
      toast.error('강사만 접근할 수 있는 페이지입니다.');
      navigate('/mypage/student/settings'); // 학생 마이페이지로 리다이렉트 (적절한 경로로 수정)
    } else if (!user) {
      toast.info('로그인이 필요합니다.');
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'instructor') {
    return null; // 리다이렉트 중에는 아무것도 렌더링하지 않음
  }

  return (
    <MyPageContainer>
      <Sidebar>
        <SidebarHeader>
          <h3>{user.name} 강사님</h3> {/* 강사님으로 표시 */}
          <p>{user.email}</p>
        </SidebarHeader>
        <MenuList>
          <MenuItem>
            <a
              href="/mypage/instructor/settings"
              className={
                location.pathname.startsWith('/mypage/instructor/settings') ? 'active' : ''
              }
            >
              설정
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="/mypage/instructor/inquiry"
              className={location.pathname.startsWith('/mypage/instructor/inquiry') ? 'active' : ''}
            >
              1:1 문의
            </a>
          </MenuItem>
          {/* 추가될 강사 관련 메뉴들 (예: 내 강의 관리, 매출 통계 등) */}
          <MenuItem>
            <a
              href="/mypage/instructor/my-lectures"
              className={
                location.pathname.startsWith('/mypage/instructor/my-lectures') ? 'active' : ''
              }
            >
              내 강의 관리
            </a>
          </MenuItem>
          <MenuItem>
            <a
              href="/mypage/instructor/revenue-statistics"
              className={
                location.pathname.startsWith('/mypage/instructor/revenue-statistics')
                  ? 'active'
                  : ''
              }
            >
              매출 통계
            </a>
          </MenuItem>
        </MenuList>
      </Sidebar>
      <MainContent>
        <Outlet /> {/* 중첩된 라우트의 내용이 여기에 렌더링됩니다. */}
      </MainContent>
    </MyPageContainer>
  );
};

export default InstructorMyPage;
