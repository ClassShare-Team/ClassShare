import React from 'react';
import styled from 'styled-components';
import { Search as SearchIcon } from './Search';
import { theme } from '@/components/styles/theme';

export const SearchBar = () => {
  return (
    <SearchWrapper>
      <InputWrapper>
        <Input placeholder="나에게 필요한 강의를 찾아보세요" />
        <IconWrapper>
          <SearchIcon width={20} height={20} color={theme.colors.gray200} />
        </IconWrapper>
      </InputWrapper>
      <SearchButton>검색</SearchButton>
    </SearchWrapper>
  );
};

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 460px;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 40px 0 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  font-size: 14px;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const SearchButton = styled.button`
  width: 132px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`;
