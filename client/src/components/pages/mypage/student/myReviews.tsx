import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Review {
  id: number;
  lectureTitle: string;
  rating: number;
  content: string;
  createdAt: string;
}

const StudentMyReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/my-reviews`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!res.ok) throw new Error('리뷰 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <MyReviewsContainer>
      <Title>내 리뷰</Title>
      <Description>작성한 강의 리뷰 목록입니다.</Description>
      <ReviewList>
        {reviews.map((review) => (
          <ReviewItem key={review.id}>
            <ReviewHeader>
              <h4>{review.lectureTitle}</h4>
            </ReviewHeader>
            <p>{review.content}</p>
            <Date>{review.createdAt}</Date>
          </ReviewItem>
        ))}
      </ReviewList>
    </MyReviewsContainer>
  );
};

export default StudentMyReviewsPage;

const MyReviewsContainer = styled.div`
  padding: 24px;
  background-color: linear-gradient(to bottom, #fef7ff, #f0f9ff);
  min-height: calc(100vh - 80px);
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
  }
`;

const Date = styled.p`
  margin-top: 8px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray400};
`;
