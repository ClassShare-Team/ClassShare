import { useEffect, useState } from 'react';
import styled from 'styled-components';
import DefaultProfileImage from '@/assets/UserProfileLogo.png';

interface Student {
  userId: number;
  nickname: string;
  profileImage: string;
  lectureId?: number;
  lectureTitle?: string;
  purchasedAt?: string;
}

interface Lecture {
  id: number;
  title: string;
}

const InstructorMyStudentPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [lectureList, setLectureList] = useState<Lecture[]>([]);
  const [selectedLectureId, setSelectedLectureId] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthInfo = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) throw new Error('로그인이 필요합니다.');

    const payload = JSON.parse(atob(token.split('.')[1]));
    const instructorId = payload.id;

    return { token, instructorId };
  };

  const fetchStudents = async (lectureId: number | 'all') => {
    setLoading(true);
    setError(null);
    try {
      const { token } = getAuthInfo();
      const base = `${import.meta.env.VITE_API_URL}/users/me/students`;
      const url = lectureId === 'all' ? `${base}/all` : `${base}/by-lecture?lectureId=${lectureId}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('수강생 정보를 불러오지 못했습니다.');

      const data = await res.json();
      const parsed = Array.isArray(data.students) ? data.students : data;
      setStudents(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const fetchLectures = async () => {
    try {
      const { token, instructorId } = getAuthInfo();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/instructors/${instructorId}/lectures`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          const errorBody = await res.json();
          if (errorBody.message === '강사 프로필 없음') {
            throw new Error('강사 등록 정보가 없습니다. 관리자에게 문의하세요.');
          }
        }
        throw new Error('강의 정보를 불러오지 못했습니다.');
      }

      const data = await res.json();
      const parsed = Array.isArray(data) ? data : (data.lectures ?? []);
      setLectureList(parsed);
    } catch (err) {
      console.error('fetchLectures 오류:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류 발생');
    }
  };

  useEffect(() => {
    fetchLectures();
    fetchStudents('all');
  }, []);

  const handleFilterClick = (lectureId: number | 'all') => {
    setSelectedLectureId(lectureId);
    fetchStudents(lectureId);
  };

  return (
    <Container>
      <Card>
        {loading ? (
          <Message>불러오는 중</Message>
        ) : error ? (
          <Message>오류: {error}</Message>
        ) : (
          <>
            <ButtonGroup>
              <FilterButton
                active={selectedLectureId === 'all'}
                onClick={() => handleFilterClick('all')}
              >
                전체
              </FilterButton>
              {lectureList.map((lecture) => (
                <FilterButton
                  key={lecture.id}
                  active={selectedLectureId === lecture.id}
                  onClick={() => handleFilterClick(lecture.id)}
                >
                  {lecture.title}
                </FilterButton>
              ))}
            </ButtonGroup>

            <h3>수강생: {students.length}명</h3>

            <List>
              {students.map((s) => (
                <StudentCard key={s.userId}>
                  <UserLogo src={s.profileImage || DefaultProfileImage} alt="profile" />
                  <NickName>{s.nickname}</NickName>
                </StudentCard>
              ))}
            </List>
          </>
        )}
      </Card>
    </Container>
  );
};

export default InstructorMyStudentPage;

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
  max-width: 600px;
  margin: 0 auto;
  min-height: 500px;
`;

const Message = styled.div`
  padding: 60px;
  font-size: 18px;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 2px solid ${({ active, theme }) => (active ? theme.colors.purple : theme.colors.gray300)};
  background-color: ${({ active, theme }) => (active ? theme.colors.purple : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border-radius: 20px;
  white-space: nowrap;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
  gap: 16px;
`;

const StudentCard = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
`;

const UserLogo = styled.img`
  width: 36px;
  height: 36px;
  background-color: #ddd;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
`;

const NickName = styled.div`
  font-weight: bold;
`;
