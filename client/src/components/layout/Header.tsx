import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import UserMenu from '../common/UserMenu';

export const Header = () => {
  const navigate = useNavigate();

  // 추후에 isLoggedIn을 실제 로그인 상태 (토큰, 세션 등)으로 대체
  const isLoggedIn = true;

  return (
    <HeaderWrapper>
      <TopRow>
        <LeftArea></LeftArea>
        <CenterArea>
          <SearchBar />
        </CenterArea>
        <RightArea>
          {isLoggedIn ? (
            <UserMenu
              //현재는 mock데이터로 설정. 추후에 변경 예정
              userName="홍길동"
              userImage={null}
              point={25000}
            />
          ) : (
            <LoginButton onClick={() => navigate('/login')}>로그인</LoginButton>
          )}
        </RightArea>
      </TopRow>
      <BottomRow></BottomRow>
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  height: 65px;
  padding: 0 16px;
  max-width: 1271px;
  width: 100%;
  margin: 0 auto;
`;

const LeftArea = styled.div`
  width: 132px;
`;

const CenterArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const RightArea = styled.div`
  width: 132px;
  display: flex;
  justify-content: flex-end;
`;

const BottomRow = styled.div`
  height: 45px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  max-width: 1271px;
  width: 100%;
  margin: 0 auto;
`;

const LoginButton = styled.button`
  width: 132px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;
