import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  instructorNickname: string;
  purchasedAt: string;
}

const StudentMyCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/my-lectures`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!res.ok) throw new Error('수강 강의를 불러오지 못했습니다.');

        const data = await res.json();
        setCourses(data.lectures);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <Container>
      <h2>내 수강 강의</h2>
      <CourseGrid>
        {courses.map((course) => (
          <CourseCard key={course.id}>
            <img src={course.thumbnail} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.instructorNickname}</p>
            <span>{new Date(course.purchasedAt).toLocaleDateString()}</span>
          </CourseCard>
        ))}
      </CourseGrid>
    </Container>
  );
};

export default StudentMyCoursesPage;

const Container = styled.div`
  padding: 40px;
  background-color: linear-gradient(to bottom, #fef7ff, #f0f9ff);
  min-height: calc(100vh - 80px);
`;

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  min-height: 300px;
`;

const CourseCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: default;

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
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray400};
  }
`;
