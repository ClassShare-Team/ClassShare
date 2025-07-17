import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Lecture {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

const InstructorMyLecturePage = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/lectures/my-lectures`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!res.ok) throw new Error('내 강의 목록을 불러오지 못했습니다.');
        const data = await res.json();
        setLectures(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <Container>
      <h2>내 강의 목록</h2>
      <LectureGrid>
        {lectures.map((lecture) => (
          <LectureCard key={lecture.id}>
            <img src={lecture.thumbnail} alt={lecture.title} />
            <h3>{lecture.title}</h3>
            <p>{lecture.description}</p>
            <span>{lecture.price.toLocaleString()}원</span>
          </LectureCard>
        ))}
      </LectureGrid>
    </Container>
  );
};

export default InstructorMyLecturePage;

const Container = styled.div`
  padding: 40px;
`;

const LectureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
`;

const LectureCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  h3 {
    font-size: 16px;
    margin-bottom: 6px;
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray500};
    margin-bottom: 6px;
  }
  span {
    font-weight: bold;
  }
`;
