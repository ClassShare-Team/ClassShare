import React from 'react';
import styled from 'styled-components';
import { Search as SearchIcon } from './Search';
import { theme } from '../styles/theme';
import { useNavigate } from 'react-router-dom';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e5e7eb;
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0 16px;
  height: 65px;
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 1271px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(6, 182, 212, 1), rgba(139, 92, 246, 1));
`;

const Brand = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
`;

const SearchArea = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 523px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 460px;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 40px 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
`;

const SearchButton = styled.button`
  width: 132px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  width: 132px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  box-sizing: border-box;
`;

export const Header = () => {
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <HeaderInner>
        <LeftGroup onClick={() => navigate('/')}>
          <Logo />
          <Brand>ClassShare</Brand>
        </LeftGroup>

        <SearchArea>
          <SearchInputWrapper>
            <SearchInput placeholder="나에게 필요한 강의를 찾아보세요" />
            <SearchIconWrapper>
              <SearchIcon width={20} height={20} color={theme.colors.gray300} />
            </SearchIconWrapper>
          </SearchInputWrapper>
          <SearchButton>검색</SearchButton>
        </SearchArea>

        <ButtonGroup>
          <ActionButton>로그인</ActionButton>
          <ActionButton>회원가입</ActionButton>
        </ButtonGroup>
      </HeaderInner>
    </HeaderWrapper>
  );
};
