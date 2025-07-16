import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useUser } from '@/contexts/UserContext';
import UserProfileLogo from '@/assets/UserProfileLogo.png';
import { useNavigate } from 'react-router-dom';

type InstructorInfo = {
  introduction: string | null;
  studentCount: number;
  reviewCount: number;
  lectures: {
    id: number;
    title: string;
    thumbnail?: string;
  }[];
};

const InstructorInfoPage = () => {
  const { user } = useUser();
  const [info, setInfo] = useState<InstructorInfo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [introductionText, setIntroductionText] = useState('');
  const navigate = useNavigate();

  const fetchInfo = async () => {
    if (!user || user.role !== 'instructor') return;
    const token = localStorage.getItem('accessToken');

    try {
      const [studentRes, reviewRes, profileRes, lectureRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/instructors/${user.id}/student-count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/instructors/${user.id}/review-count`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/user/my-lectures`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const studentData = await studentRes.json();
      const reviewData = await reviewRes.json();
      const profileData = await profileRes.json();
      const lectureData = await lectureRes.json();

      setInfo({
        introduction: profileData.instructor_profile?.introduction || '',
        studentCount: studentData.count,
        reviewCount: reviewData.count,
        lectures: lectureData,
      });
      setIntroductionText(profileData.instructor_profile?.introduction || '');
    } catch (err) {
      console.error('강사 정보 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, [user]);

  const handleSaveIntroduction = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/instructor-introduction`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ introduction: introductionText }),
      });

      if (res.ok) {
        await fetchInfo();
        setEditMode(false);
      } else {
        alert('소개글 저장에 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || !info) return <Container>로딩 중</Container>;

  return (
    <Container>
      <Left>
        <ProfileImage src={user.profile_image || UserProfileLogo} alt="profile" />
        <Name>{user.name}</Name>
        <Stats>
          <StatBlock>
            <Label>수강생수</Label>
            <Value>{info.studentCount.toLocaleString()}</Value>
          </StatBlock>
          <StatBlock>
            <Label>수강평수</Label>
            <Value>{info.reviewCount.toLocaleString()}</Value>
          </StatBlock>
        </Stats>
        <EditButton onClick={() => setEditMode((prev) => !prev)}>
          {editMode ? '취소' : '수정'}
        </EditButton>
        {editMode && <SaveButton onClick={handleSaveIntroduction}>소개글 저장</SaveButton>}
      </Left>

      <Right>
        <Section>
          <SectionTitle>소개</SectionTitle>
          <SectionContent>
            {editMode ? (
              <textarea
                placeholder="소개글을 입력하세요"
                value={introductionText}
                onChange={(e) => setIntroductionText(e.target.value)}
              />
            ) : info.introduction ? (
              info.introduction
            ) : (
              '소개글이 비어있어요'
            )}
          </SectionContent>
        </Section>

        <Section>
          <SectionTitle>
            강의 <LectureCount>전체 {info.lectures.length}</LectureCount>
          </SectionTitle>
          <LectureList>
            {info.lectures.map((lecture) => (
              <LectureCard key={lecture.id}>
                <img src={lecture.thumbnail || ''} alt="thumbnail" />
                <p>{lecture.title}</p>
              </LectureCard>
            ))}
            {editMode && (
              <LectureCard isAdd>
                <button onClick={() => navigate('/lecturepage')}>강의 추가</button>
              </LectureCard>
            )}
          </LectureList>
        </Section>
      </Right>
    </Container>
  );
};

export default InstructorInfoPage;

const Container = styled.div`
  display: flex;
  padding: 40px;
  gap: 40px;
`;

const Left = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.gray300};
`;

const Name = styled.h2`
  margin: 12px 0;
  font-size: 20px;
`;

const Stats = styled.div`
  width: 100%;
  border-top: 1px dotted ${({ theme }) => theme.colors.gray300};
  border-bottom: 1px dotted ${({ theme }) => theme.colors.gray300};
  padding: 16px 0;
  text-align: center;
`;

const StatBlock = styled.div`
  margin: 6px 0;
`;

const Label = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray400};
`;

const Value = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const EditButton = styled.button`
  margin-top: 20px;
  padding: 10px 24px;
  border: 1px solid black;
  background: ${({ theme }) => theme.colors.purple100};
  cursor: pointer;
`;

const SaveButton = styled.button`
  margin-top: 12px;
  padding: 8px 20px;
  background-color: ${({ theme }) => theme.colors.purple};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const Right = styled.div`
  flex: 1;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
`;

const SectionContent = styled.div`
  margin-top: 12px;
  padding: 16px;
  background: #fafafa;
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  min-height: 80px;
  white-space: pre-wrap;

  textarea {
    width: 100%;
    height: 100px;
    font-size: 16px;
    resize: none;
  }
`;

const LectureCount = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.purple};
  margin-left: 6px;
`;

const LectureList = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
`;

const LectureCard = styled.div<{ isAdd?: boolean }>`
  width: 160px;
  height: 100px;
  border: 1px solid ${({ theme }) => theme.colors.gray100};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  cursor: ${({ isAdd }) => (isAdd ? 'pointer' : 'default')};

  img {
    width: 100%;
    height: 70%;
    object-fit: cover;
  }

  p {
    font-size: 14px;
    margin-top: 6px;
    text-align: center;
  }

  button {
    background: none;
    border: none;
    color: #333;
    font-size: 14px;
    cursor: pointer;
  }
`;
