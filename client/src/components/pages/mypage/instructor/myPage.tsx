import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useMyPageInfo from '@/components/hooks/useMyPageInfo';

const InstructorMyPage = () => {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useMyPageInfo();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  if (!userInfo) return <div>유저 정보를 불러오지 못했습니다.</div>;

  return (
    <MyPageContainer>
      <Sidebar>
        <SidebarHeader>
          <h3>{userInfo.nickname || '닉네임 없음'}</h3>
          <p>{userInfo.email}</p>
        </SidebarHeader>
        <MenuItem onClick={() => navigate('/instructor/mypage')}>내 정보</MenuItem>
        <MenuItem onClick={() => navigate('/instructor/mylecture')}>내 강의</MenuItem>
        <MenuItem onClick={() => navigate('/instructor/salesreport')}>매출 관리</MenuItem>
        <MenuItem onClick={() => navigate('/instructor/mystudent')}>수강생 관리</MenuItem>
        <MenuItem onClick={() => navigate('/instructor/inquiry')}>문의</MenuItem>
        <MenuItem onClick={() => navigate('/instructor/setting')}>설정</MenuItem>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </MyPageContainer>
  );
};

export default InstructorMyPage;

const MyPageContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
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
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const MenuItem = styled.div`
  font-size: 16px;
  padding: 12px 0;
  cursor: pointer;
  width: 100%;
  text-align: center;
  &:hover {
    color: ${({ theme }) => theme.colors.purple};
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;

const Content = styled.div`
  flex: 1;
  margin-left: 40px;
  padding-right: 50px;
`;
