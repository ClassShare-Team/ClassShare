import React from 'react';
import styled from 'styled-components';
import LectureCard from '../../common/LectureCard';

const Wrapper = styled.div`
  padding: 40px 80px; /* 위아래 40px, 좌우 80px 여백 */
  height: 80vh; /* 원하는 높이 지정 (예: 화면 80%) */
  overflow-y: auto; /* 세로 스크롤 가능 */
  box-sizing: border-box;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(397px, 1fr));
  gap: 40px;
  justify-content: center;
  max-width: calc(397px * 3 + 40px * 2);
  margin: 0 auto;
`;

export const EnrollPage = () => {
  return (
    <Wrapper>
      <GridContainer>
        <LectureCard />
        <LectureCard />
        <LectureCard />
        <LectureCard />
        <LectureCard />
      </GridContainer>
    </Wrapper>
  );
};
