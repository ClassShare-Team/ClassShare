import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Search as SearchIcon } from './Search';
import { theme } from '@/components/styles/theme';

export const SearchBar: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  // 공백이 아닌 검색어가 있을 때만 /search 페이지로 이동
  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (trimmed.length === 0) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  // 엔터 키로도 검색이 실행되도록 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SearchWrapper>
      <InputWrapper>
        <Input
          placeholder="나에게 필요한 강의를 찾아보세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconWrapper>
          <SearchIcon width={20} height={20} color={theme.colors.gray200} />
        </IconWrapper>
      </InputWrapper>
      <SearchButton onClick={handleSearch}>검색</SearchButton>
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
  margin-left: 10px;
  width: 460px;
  @media (max-width: 1024px) {
    width: 300px;
  }

  @media (max-width: 768px) {
    width: 200px;
  }
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
