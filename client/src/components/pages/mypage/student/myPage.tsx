import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useMyPageInfo from '@/components/hooks/useMyPageInfo';

const StudentMyPage = () => {
  const navigate = useNavigate();
  const { userInfo, loading, error } = useMyPageInfo();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error.message}</div>;
  if (!userInfo) return <div>유저 정보를 불러오지 못했습니다.</div>;

  return (
    <MyPageLayout>
      <ProfileSection>
        <img src={userInfo.profile_image} alt="profile" />
        <h2>{userInfo.nickname || '닉네임 없음'}</h2>
        <p>{userInfo.email}</p>
      </ProfileSection>

      <NavMenu>
        <MenuItem onClick={() => navigate('/student/mycourse')}>내 수강 강의</MenuItem>
        <MenuItem onClick={() => navigate('/student/myreview')}>내 리뷰</MenuItem>
        <MenuItem onClick={() => navigate('/student/inquiry')}>문의</MenuItem>
        <MenuItem onClick={() => navigate('/student/setting')}>설정</MenuItem>
      </NavMenu>
    </MyPageLayout>
  );
};

export default StudentMyPage;

const MyPageLayout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.gray100};
  min-height: calc(100vh - 80px);
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
