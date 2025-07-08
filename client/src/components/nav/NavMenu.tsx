import React from 'react';
import styled from 'styled-components';
import { Dropdown } from './Dropdown';

export const NavMenu = () => {
  return (
    <MenuWrapper>
      <Dropdown label="강의" items={['전체', '교육', '개발', '음악', '요리', '운동', '예술', '글쓰기']} />
      <Dropdown label="수강 중인 강의" items={['내 강의실', '진도 현황']} />
      <Dropdown label="게시판" items={['전체 게시판', '질문 게시판', '자유 게시판']} />
      <Dropdown label="쉐어톡" items={['오픈 쉐어톡', '1:1 쉐어톡']} />
    </MenuWrapper>
  );
};

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  height: 100%;
`;
