import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Student {
  id: number;
  name: string;
  email: string;
  lectureTitle: string;
  enrolledAt: string;
}

const InstructorMyStudentPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/instructor/students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        if (!res.ok) throw new Error('수강생 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('알 수 없는 오류 발생');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    <Container>
      <h2>수강생 목록</h2>
      <Table>
        <thead>
          <tr>
            <th>이름</th>
            <th>이메일</th>
            <th>강의</th>
            <th>수강일</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.lectureTitle}</td>
              <td>{s.enrolledAt}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default InstructorMyStudentPage;

const Container = styled.div`
  padding: 40px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.colors.gray200};
    text-align: left;
  }

  th {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`;
