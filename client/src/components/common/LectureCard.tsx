import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/colors';

interface LectureCardProps {
  thumbnail?: string;
  title: string;
  instructorId: number | string;
  description?: string;
  price?: number;
  category?: string;
}

const Card = styled.div`
  width: 397px;
  border: 1px solid ${colors.gray100};
  border-radius: 12px;
  overflow: hidden;
  box-sizing: border-box;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const ImageWrapper = styled.div`
  width: 395px;
  height: 192px;
  border-radius: 12px 12px 12px 12px;
  overflow: hidden;
  background-color: ${colors.gray200};
  margin: 0 auto;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Content = styled.div`
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Category = styled.div`
  display: inline-block;
  height: 13px;
  padding: 0 6px; /* 좌우 여백만 */
  background-color: ${colors.gray100};
  color: ${colors.purple};
  font-size: 0.7rem;
  text-align: center;
  border-radius: 4px;
  line-height: 13px; /* 텍스트 수직 가운데 정렬 */
  width: fit-content; /* 내용에 따라 가변 너비 */
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  color: #333;
  font-weight: 600;
`;

const Instructor = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #666;
  flex-grow: 1;
  margin: 0;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.div<{ isFree: boolean }>`
  font-weight: bold;
  font-size: 1.1rem;
  color: ${({ isFree }) => (isFree ? colors.purple : '#000000')};
`;

const RegisterButton = styled.button`
  width: 74px;
  height: 29px;
  background-color: ${colors.purple};
  color: ${colors.white};
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  width: 300px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  text-align: center;
`;

const CancelButton = styled(RegisterButton)`
  background-color: ${colors.gray200}; /* 회색 계열 배경 */
  color: white;

  &:hover {
    opacity: 0.8;
  }
`;

const LectureCard: React.FC<LectureCardProps> = ({
  thumbnail,
  title,
  instructorId,
  description,
  price = 0,
  category,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFree = price === 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Card>
        <ImageWrapper>
          {thumbnail ? (
            <Thumbnail src={thumbnail} alt={`${title} 썸네일`} />
          ) : (
            <div>이미지 없음</div>
          )}
        </ImageWrapper>
        <Content>
          <Category>{category || '카테고리'}</Category>
          <Title>강좌 제목 : {title}</Title>
          <Instructor>강사 ID : {instructorId}</Instructor>
          <Description>
            강의 설명 : {description || '이 강의는 리액트 초보자를 위한 입문 강좌입니다.'}
          </Description>
          <PriceRow>
            <Price isFree={isFree}>{isFree ? '무료' : `${price.toLocaleString()} 포인트`}</Price>
            <RegisterButton onClick={openModal}>결제</RegisterButton>
          </PriceRow>
        </Content>
      </Card>

      {isModalOpen && (
        <ModalBackground onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div>{`강좌 "${title}" 결제하시겠습니까?`}</div>
            <div style={{ marginTop: '8px', fontWeight: 'bold' }}>
              {isFree ? '무료' : `${price.toLocaleString()} 포인트`}
            </div>
            <div
              style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '12px' }}
            >
              <CancelButton onClick={closeModal}>취소</CancelButton>
              <RegisterButton onClick={closeModal}>결제</RegisterButton>
            </div>
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
};

export default LectureCard;
