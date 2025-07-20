import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import UserProfileLogo from '@/assets/UserProfileLogo.png';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <Container ref={menuRef}>
      <Wrapper onClick={() => setOpen((prev) => !prev)}>
        <UserLogo src={user.profile_image || UserProfileLogo} alt="user" />
        <UserNickname>{user.nickname || '닉네임 없음'}</UserNickname>
      </Wrapper>

      {open && (
        <Dropdown>
          <UserInfoRow>
            <ProfileImage src={user.profile_image || UserProfileLogo} alt="profile" />
            <InfoText>
              <UserName>{user.name || '이름 없음'}</UserName>
              <UserPoint>남은 포인트: {(user.point_balance ?? 0).toLocaleString()}P</UserPoint>
            </InfoText>
          </UserInfoRow>

          <UserDetailRow>
            <DetailLabel>이메일</DetailLabel>
            <DetailValue>{user.email || '이메일 없음'}</DetailValue>
          </UserDetailRow>
          <UserDetailRow>
            <DetailLabel>역할</DetailLabel>
            <DetailValue>{user.role === 'student' ? '학생' : '강사'}</DetailValue>
          </UserDetailRow>
          <Divider />
          <DropdownItem
            onClick={() => {
              if (user.role === 'instructor') {
                navigate('/instructor/mypage');
              } else {
                navigate('/student/mypage');
              }
            }}
          >
            마이페이지
          </DropdownItem>

          {user.role === 'instructor' && (
            <DropdownItem onClick={() => navigate('/instructor-info')}>강사 Info</DropdownItem>
          )}
          <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
        </Dropdown>
      )}
    </Container>
  );
};

export default UserMenu;

const Container = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const UserLogo = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserNickname = styled.span`
  font-weight: 600;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  width: 260px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 12px;
  z-index: 100;
`;

const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const UserPoint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
`;

const UserDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 4px 0;
  color: ${({ theme }) => theme.colors.gray500};
`;

const DetailLabel = styled.span`
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-weight: 400;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  margin: 12px 0;
`;

const DropdownItem = styled.div`
  font-size: 16px;
  padding: 6px 0;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.purple};
  }
`;
