import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/nav/Logo';
import { NavMenu } from '@/components/nav/NavMenu';
import { SearchBar } from './SearchBar';
import UserMenu from '@/components/common/UserMenu';
import { useUser } from '@/contexts/UserContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogoClick = () => {

    localStorage.setItem("selectedCategory", "전체");
    window.location.href = "/main"; 
  };

  return (
    <HeaderWrapper>
      <TopRow>
        <LeftArea>
          <Logo onClick={handleLogoClick} />
        </LeftArea>
        <CenterArea>
          <SearchBar />
        </CenterArea>
        <RightArea>
          {user ? (
            <UserMenu />
          ) : (
            <LoginButton onClick={() => navigate('/login')}>로그인</LoginButton>
          )}
        </RightArea>
      </TopRow>
      <BottomRow>
        <NavMenu />
      </BottomRow>
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