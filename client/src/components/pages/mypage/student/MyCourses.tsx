import React from 'react';
import styled from 'styled-components';

const MyCoursesContainer = styled.div`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h3`
  ${({ theme }) => theme.fonts.h1}; /* h1 스타일 적용 */
  font-size: 24px; /* h1보다 약간 작게 조정 */
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
`;

const CourseThumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 16px;
`;

const CourseDetails = styled.div`
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.black};
    margin-bottom: 4px;
  }
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray500};
    margin-bottom: 2px;
  }
  span {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.purple};
    font-weight: 500;
  }
`;

const ViewCourseButton = styled.button`
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.colors.purple};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #6a2cdb; /* 약간 어두운 보라색 */
  }
`;

const MyCourses = () => {
  return (
    <MyCoursesContainer>
      <Title>나의 강의 관리</Title>
      <Description>
        여기에 수강 중인 강의 목록을 표시합니다. 각 강의의 진행 상황, 수강 기간 등을 확인할 수 있습니다.
      </Description>
      <CourseList>
        <CourseItem>
          <CourseInfo>
            <CourseThumbnail src="https://placehold.co/80x80/7a36ff/FFFFFF?text=강의" alt="Course Thumbnail" />
            <CourseDetails>
              <h4>2025 VEI•JON C. Java, Python + CS</h4>
              <p>강사: 김철수</p>
              <span>진행률: 75%</span>
            </CourseDetails>
          </CourseInfo>
          <ViewCourseButton>강의 보기</ViewCourseButton>
        </CourseItem>
        <CourseItem>
          <CourseInfo>
            <CourseThumbnail src="https://placehold.co/80x80/7a36ff/FFFFFF?text=강의" alt="Course Thumbnail" />
            <CourseDetails>
              <h4>JavaScript & TypeScript 기초</h4>
              <p>강사: 박영희</p>
              <span>진행률: 40%</span>
            </CourseDetails>
          </CourseInfo>
          <ViewCourseButton>강의 보기</ViewCourseButton>
        </CourseItem>
        {/* 더 많은 강의 항목을 추가할 수 있습니다. */}
      </CourseList>
    </MyCoursesContainer>
  );
};

export default MyCourses;