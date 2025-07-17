import { useEffect, useState } from 'react';
import styled from 'styled-components';

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

  const fetchStudents = async (lectureId: number | 'all') => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('로그인이 필요합니다.');

      const base = `${import.meta.env.VITE_API_URL}/users/me/students`;
      const url = lectureId === 'all' ? `${base}/all` : `${base}/by-lecture?lectureId=${lectureId}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('수강생 정보를 불러오지 못했습니다.');
      const data = await res.json();
      setStudents(data.students || []);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('알 수 없는 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  const fetchLectures = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const instructorId = localStorage.getItem('userId');
      if (!token || !instructorId) throw new Error('로그인이 필요합니다.');

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/instructor/${instructorId}/lectures`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('강의 정보를 불러오지 못했습니다.');

      const text = await res.text();
      console.log('📘 강의 응답 원문:', text);

      const json = JSON.parse(text);

      // 형태가 배열이면 그대로, 객체 안에 lectures 배열이 있으면 그걸로 설정
      const lectures = Array.isArray(json)
        ? json
        : Array.isArray(json.lectures)
          ? json.lectures
          : [];

      console.log('✅ 최종 파싱된 강의 목록:', lectures);
      setLectureList(lectures);
    } catch (err) {
      console.error('❌ fetchLectures 오류:', err);
      if (err instanceof Error) setError(err.message);
      else setError('알 수 없는 오류 발생');
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <Container>
      <ButtonGroup>
        <FilterButton active={selectedLectureId === 'all'} onClick={() => handleFilterClick('all')}>
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
            <Avatar src={s.profileImage || '/default-avatar.png'} alt="profile" />
            <NickName>{s.nickname}</NickName>
          </StudentCard>
        ))}
      </List>
    </Container>
  );
};

export default InstructorMyStudentPage;

// ---------- Styled Components ----------

const Container = styled.div`
  padding: 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: 2px solid ${({ active, theme }) => (active ? theme.colors.purple : theme.colors.gray300)};
  background-color: ${({ active, theme }) => (active ? theme.colors.purple : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border-radius: 20px;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StudentCard = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
`;

const Avatar = styled.img`
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
