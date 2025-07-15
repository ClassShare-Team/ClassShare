import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import UserProfileLogo from '@/assets/UserProfileLogo.png';

type UserMenuProps = {
  userName: string;
  userImage?: string | null;
  point: number;
};

const UserMenu = ({ userName, userImage, point }: UserMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Container ref={menuRef}>
      <Wrapper onClick={() => setOpen((prev) => !prev)}>
        <UserLogo src={userImage || UserProfileLogo} alt="user" />
        <UserName>{userName}</UserName>
      </Wrapper>

      {open && (
        <Dropdown>
          <UserInfoRow>
            <ProfileImage src={userImage || UserProfileLogo} alt="profile" />
            <InfoText>
              <UserRealName>{userName}</UserRealName>
              <UserPoint>남은 포인트: {point.toLocaleString()}P</UserPoint>
            </InfoText>
          </UserInfoRow>

          <Divider />

          <DropdownItem>마이페이지</DropdownItem>
          <DropdownItem>로그아웃</DropdownItem>
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

const UserName = styled.span`
  font-weight: 600;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  width: 240px;
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

const UserRealName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const UserPoint = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray400};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  margin: 12px 0;
`;

const DropdownItem = styled.div`
  font-size: 14px;
  padding: 6px 0;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.purple};
  }
`;
