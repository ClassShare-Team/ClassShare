import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import useMyPageInfo from '@/components/hooks/useMyPageInfo';

const InstructorMyPage = () => {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useMyPageInfo();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  if (!userInfo) return <div>유저 정보를 불러오지 못했습니다.</div>;

  return (
    <MyPageLayout>
      <Card>
        <ProfileSection>
          <img src={userInfo.profile_image} alt="profile" />
          <h2>{userInfo.name || '이름 없음'}</h2>
          <InfoText>{userInfo.nickname || '닉네임 없음'}</InfoText>
          <InfoText>{userInfo.email}</InfoText>
          <InfoText>{userInfo.role === 'instructor' ? '강사' : '학생'}</InfoText>
        </ProfileSection>

        <NavMenu>
          <MenuItem onClick={() => navigate('/instructor/mypage')}>내 정보</MenuItem>
          <MenuItem onClick={() => navigate('/instructor/mylecture')}>내 강의</MenuItem>
          <MenuItem onClick={() => navigate('/instructor/mystudent')}>수강생 관리</MenuItem>
          <MenuItem onClick={() => navigate('/instructor/setting')}>설정</MenuItem>
        </NavMenu>
      </Card>

      <Content>
        <Outlet />
      </Content>
    </MyPageLayout>
  );
};

export default InstructorMyPage;

const MyPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: linear-gradient(to bottom, #fef7ff, #f0f9ff);
  min-height: calc(100vh - 80px);
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(49, 72, 187, 0.09);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileSection = styled.section`
  text-align: center;
  margin-bottom: 30px;

  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 20px;
    margin: 8px 0;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray500};
  }
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
`;

const MenuItem = styled.div`
  font-size: 16px;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.purple};
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;
  margin-top: 40px;
`;

const InfoText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 6px;
  white-space: pre-line;
`;
