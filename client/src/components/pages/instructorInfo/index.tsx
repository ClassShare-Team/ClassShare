import { useEffect, useState } from 'react';
import styled from 'styled-components';

type InstructorInfo = {
  name: string;
  nickname: string;
  studentCount: number;
  reviewCount: number;
};

const InstructorInfoPage = () => {
  const [info, setInfo] = useState<InstructorInfo | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/user/instructor-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setInfo(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchInfo();
  }, []);

  if (!info) return <Wrapper>로딩 중</Wrapper>;

  return (
    <Wrapper>
      <h1>강사 정보</h1>
      <p>이름: {info.name}</p>
      <p>닉네임: {info.nickname}</p>
      <p>수강생 수: {info.studentCount}</p>
      <p>수강평 수: {info.reviewCount}</p>
    </Wrapper>
  );
};

export default InstructorInfoPage;

const Wrapper = styled.div`
  padding: 40px;
`;
