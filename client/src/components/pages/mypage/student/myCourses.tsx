import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  instructor: string;
  enrolledAt: string;
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

        //data 콘솔 로그
        console.log('응답 데이터:', data);
        setCourses(data);
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
    <MyCoursesContainer>
      <Title>내 수강 강의</Title>
      <Description>신청한 강의 목록입니다.</Description>
      <CourseList>
        {courses.map((course) => (
          <CourseItem key={course.id}>
            <CourseInfo>
              <CourseThumbnail src={course.thumbnail} alt={course.title} />
              <div>
                <div>
                  <strong>{course.title}</strong>
                </div>
                <div>{course.instructor}</div>
              </div>
            </CourseInfo>
            <div>{course.enrolledAt}</div>
          </CourseItem>
        ))}
      </CourseList>
    </MyCoursesContainer>
  );
};

export default StudentMyCoursesPage;

const MyCoursesContainer = styled.div`
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

const CourseList = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CourseItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;
`;

const CourseInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CourseThumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;
