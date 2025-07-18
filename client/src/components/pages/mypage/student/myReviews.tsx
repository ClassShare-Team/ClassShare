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

  if (loading) return <Message>로딩 중...</Message>;
  if (error) return <Message>오류: {error}</Message>;

  return (
    <Container>
      <Card>
        <Title>내 리뷰</Title>
        <Description>작성한 강의 리뷰 목록입니다.</Description>
        <ReviewList>
          {reviews.map((review) => (
            <ReviewItem key={review.id}>
              <ReviewHeader>
                <h4>{review.lectureTitle}</h4>
              </ReviewHeader>
              <p>{review.content}</p>
            </ReviewItem>
          ))}
        </ReviewList>
      </Card>
    </Container>
  );
};

export default StudentMyReviewsPage;

const Container = styled.div`
  padding: 40px;
  background-color: linear-gradient(to bottom, #fef7ff, #f0f9ff);
  min-height: calc(100vh - 80px);
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(49, 72, 187, 0.09);
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 600px;
`;

const Title = styled.h2`
  font-size: 22px;
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 24px;
`;

const ReviewList = styled.div`
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

const Message = styled.div`
  padding: 60px;
  font-size: 18px;
  text-align: center;
`;
