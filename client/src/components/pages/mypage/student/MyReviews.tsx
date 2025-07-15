import React from 'react';
import styled from 'styled-components';

const MyReviewsContainer = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  ${({ theme }) => theme.fonts.h1};
  font-size: 24px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.black};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 24px;
`;

const ReviewList = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ReviewItem = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.black};
    margin-right: 8px;
  }
`;

const StarRating = styled.div`
  display: flex;
  /* 아이콘 제거로 인해 별 스타일링은 필요에 따라 다시 구현해야 합니다. */
  /* 현재는 플레이스홀더 텍스트로 대체됩니다. */
  font-size: 16px;
  color: #FFD700; /* 골드 색상 유지 */
`;

const ReviewContent = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 8px;
`;

const ReviewDate = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-top: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &.edit {
    background-color: ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.gray500};
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray300};
    }
  }

  &.delete {
    background-color: #EF4444; /* Red-500 */
    color: ${({ theme }) => theme.colors.white};
    &:hover {
      background-color: #DC2626; /* Red-600 */
    }
  }
`;

const MyReviews = () => {
  return (
    <MyReviewsContainer>
      <Title>작성한 리뷰</Title>
      <Description>
        여기에 작성하신 강의 리뷰 목록을 표시합니다.
      </Description>
      <ReviewList>
        <ReviewItem>
          <ReviewHeader>
            <h4>강의명: 2025 VEI•JON C. Java, Python + CS</h4>
            <StarRating>
              {/* StarIcon 대신 텍스트 또는 다른 아이콘으로 대체 */}
              ★★★★☆
            </StarRating>
          </ReviewHeader>
          <ReviewContent>
            강의 내용이 매우 유익하고 강사님의 설명이 명확해서 좋았습니다. 실습 예제도 풍부해서 이해하기 쉬웠어요.
          </ReviewContent>
          <ReviewDate>작성일: 2024.06.28</ReviewDate>
          <ButtonGroup>
            <ActionButton className="edit">수정</ActionButton>
            <ActionButton className="delete">삭제</ActionButton>
          </ButtonGroup>
        </ReviewItem>
        <ReviewItem>
          <ReviewHeader>
            <h4>강의명: JavaScript & TypeScript 기초</h4>
            <StarRating>
              {/* StarIcon 대신 텍스트 또는 다른 아이콘으로 대체 */}
              ★★★★★
            </StarRating>
          </ReviewHeader>
          <ReviewContent>
            TypeScript에 대한 이해를 높이는 데 큰 도움이 되었습니다. 코드 예시가 실용적이라 바로 적용하기 좋았습니다.
          </ReviewContent>
          <ReviewDate>작성일: 2024.06.20</ReviewDate>
          <ButtonGroup>
            <ActionButton className="edit">수정</ActionButton>
            <ActionButton className="delete">삭제</ActionButton>
          </ButtonGroup>
        </ReviewItem>
        {/* 더 많은 리뷰 항목을 추가할 수 있습니다. */}
      </ReviewList>
    </MyReviewsContainer>
  );
};

export default MyReviews;
