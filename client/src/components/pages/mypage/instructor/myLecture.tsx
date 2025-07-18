import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface Lecture {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
}

const InstructorMyLecturePage = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    const fetchLectures = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/instructors/${userId}/lectures`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('내 강의 목록을 불러오지 못했습니다.');

        const data = await res.json();
        console.log('강사 강의 응답:', data);

        if (Array.isArray(data)) {
          setLectures(data);
        } else if (Array.isArray(data.lectures)) {
          setLectures(data.lectures);
        } else {
          throw new Error('서버 응답 형식이 잘못되었습니다.');
        }
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  if (loading) return <div>로딩 중</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <Container>
      <h2>내 강의 목록</h2>
      <LectureGrid>
        {lectures.map((lecture) => (
          <LectureCard key={lecture.id} onClick={() => navigate(`/lecture/${lecture.id}/apply`)}>
            <img src={lecture.thumbnail} alt={lecture.title} />
            <h3>{lecture.title}</h3>
            <p>{lecture.description}</p>
            <span>{Number(lecture.price).toLocaleString()}원</span>
          </LectureCard>
        ))}
      </LectureGrid>
    </Container>
  );
};

export default InstructorMyLecturePage;

const Container = styled.div`
  padding: 40px;
  background-color: linear-gradient(to bottom, #fef7ff, #f0f9ff);
  min-height: calc(100vh - 80px);
`;

const LectureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  min-height: 300px;
`;

const LectureCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;

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
