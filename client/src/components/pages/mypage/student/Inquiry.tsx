import { useState, useEffect } from 'react';
import styled from 'styled-components';

const InquiryContainer = styled.div`
  padding: 40px; /* 전체 컨테이너 패딩 증가 */
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px; /* 둥근 모서리 더 강화 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08); /* 그림자 더 부드럽고 넓게 */
  max-width: 850px; /* 최대 너비 약간 증가 */
  margin: 40px auto; /* 중앙 정렬 및 상하 여백 */
  font-family: ${({ theme }) => theme.fontFamily};
`;

const Title = styled.h3`
  ${({ theme }) => theme.fonts.h1};
  font-size: 32px; /* 제목 크기 더 키움 */
  margin-bottom: 32px; /* 여백 증가 */
  color: ${({ theme }) => theme.colors.black};
  text-align: center; /* 중앙 정렬 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  padding-bottom: 20px; /* 하단 패딩 증가 */
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 32px; /* 여백 증가 */
  text-align: center;
  line-height: 1.6;
`;

const NewInquiryButton = styled.button`
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.purple};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  margin-bottom: 24px;
  width: 100%; /* 너비 100% */
  font-size: 18px; /* 폰트 크기 조정 */
  font-weight: 600;

  &:hover {
    background-color: #6a2cdb;
  }
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray300};
    cursor: not-allowed;
  }
`;

const InquiryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InquiryItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  padding: 20px; /* 패딩 증가 */
  padding-right: 100px; /* 삭제 버튼 공간 확보를 위해 오른쪽 패딩 추가 */
  position: relative; /* 삭제 버튼 위치 지정을 위해 */
`;

const InquiryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px; /* 여백 증가 */

  h4 {
    font-size: 20px; /* 폰트 크기 증가 */
    font-weight: 700; /* 더 굵게 */
    color: ${({ theme }) => theme.colors.black};
  }
  span {
    font-size: 15px; /* 폰트 크기 조정 */
    color: ${({ theme }) => theme.colors.gray600}; /* 색상 조정 */
    font-weight: 500;
  }
`;

const InquiryContentDisplay = styled.p`
  color: ${({ theme }) => theme.colors.gray700}; /* 색상 조정 */
  margin-bottom: 12px; /* 여백 증가 */
  line-height: 1.6; /* 줄 간격 조정 */
`;

const InquiryDate = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  text-align: right; /* 날짜 오른쪽 정렬 */
`;

const AnswerBox = styled.div`
  margin-top: 20px; /* 여백 증가 */
  padding: 16px; /* 패딩 증가 */
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px; /* 둥근 모서리 */
  border: 1px solid ${({ theme }) => theme.colors.gray200};

  p {
    font-size: 15px; /* 폰트 크기 조정 */
    color: ${({ theme }) => theme.colors.gray700};
    line-height: 1.5;
  }
  .answer-label {
    font-weight: 600; /* 더 굵게 */
    color: ${({ theme }) => theme.colors.black};
    margin-bottom: 8px; /* 여백 증가 */
  }
  .answer-date {
    font-size: 13px; /* 폰트 크기 조정 */
    color: ${({ theme }) => theme.colors.gray500};
    text-align: right;
    margin-top: 12px; /* 여백 증가 */
  }
`;

const InquiryForm = styled.div`
  margin-top: 30px; /* 폼 상단 여백 */
  padding: 30px; /* 폼 내부 패딩 */
  background-color: ${({ theme }) => theme.colors.gray50}; /* 배경색 변경 */
  border-radius: 12px; /* 둥근 모서리 */
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const FormLabel = styled.label`
  display: block;
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 10px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 20px; /* 여백 증가 */
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
    box-shadow: 0 0 0 3px rgba(122, 54, 255, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 14px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 8px;
  font-size: 16px;
  min-height: 150px; /* 최소 높이 설정 */
  resize: vertical; /* 수직으로만 크기 조절 가능 */
  margin-bottom: 20px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
    box-shadow: 0 0 0 3px rgba(122, 54, 255, 0.2);
  }
`;

const SubmitButton = styled(NewInquiryButton)`
  margin-top: 0; /* NewInquiryButton의 기본 margin-top 제거 */
  background-color: ${({ theme }) => theme.colors.purple};
  &:hover {
    background-color: #6a2cdb;
  }
`;

const Message = styled.p<{ type: 'success' | 'error' }>`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  font-weight: 500;
  text-align: center;
  color: ${({ type }) => (type === 'success' ? '#16A34A' : '#DC2626')};
  background-color: ${({ type }) => (type === 'success' ? '#D1FAE5' : '#FEE2E2')};
  border: 1px solid ${({ type }) => (type === 'success' ? '#34D399' : '#F87171')};
`;

const DeleteButton = styled.button`
  background-color: #ef4444; /* Tailwind red-500 */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  position: absolute; /* 문의 항목 우측 상단에 배치 */
  top: 15px;
  right: 15px; /* 오른쪽 패딩과 맞춰서 위치 조정 */
  z-index: 10; /* 다른 요소 위에 오도록 */

  &:hover {
    background-color: #dc2626; /* Tailwind red-600 */
  }
`;

const Inquiry = () => {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);

  const [inquiries, setInquiries] = useState(() => {
    const savedInquiries = localStorage.getItem('inquiries');
    return savedInquiries ? JSON.parse(savedInquiries) : [];
  });

  useEffect(() => {
    localStorage.setItem('inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmitInquiry = () => {
    setMessage(null);
    setLoading(true);

    if (!inquiryTitle.trim() || !inquiryContent.trim()) {
      setMessage({ text: '제목과 내용을 모두 입력해주세요.', type: 'error' });
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newInquiry = {
        id: inquiries.length > 0 ? Math.max(...inquiries.map((i) => i.id)) + 1 : 1,
        title: inquiryTitle,
        content: inquiryContent,
        date: new Date()
          .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
          .replace(/\. /g, '.')
          .replace(/\.$/, ''),
        status: '답변 대기 중',
        answer: null,
      };

      setInquiries((prev) => [newInquiry, ...prev]);
      setMessage({ text: '문의가 성공적으로 등록되었습니다.', type: 'success' });
      setInquiryTitle('');
      setInquiryContent('');
      setShowInquiryForm(false);
      setLoading(false);
    }, 500);
  };

  const handleDeleteInquiry = (id: number) => {
    if (window.confirm('정말로 이 문의를 삭제하시겠습니까?')) {
      setLoading(true);
      setTimeout(() => {
        const updatedInquiries = inquiries.filter((inquiry) => inquiry.id !== id);
        setInquiries(updatedInquiries);
        setMessage({ text: '문의가 성공적으로 삭제되었습니다.', type: 'success' });
        setLoading(false);
      }, 300);
    }
  };

  return (
    <InquiryContainer>
      <Title>1:1 문의</Title>
      <Description>
        궁금한 점이나 불편한 점을 문의해주세요. 신속하게 답변해 드리겠습니다.
      </Description>

      {message && <Message type={message.type}>{message.text}</Message>}

      <NewInquiryButton onClick={() => setShowInquiryForm((prev) => !prev)} disabled={loading}>
        {showInquiryForm ? '문의 작성 취소' : '새로운 문의 작성'}
      </NewInquiryButton>

      {showInquiryForm && (
        <InquiryForm>
          <FormLabel htmlFor="inquiryTitle">제목:</FormLabel>
          <FormInput
            type="text"
            id="inquiryTitle"
            placeholder="문의 제목을 입력하세요"
            value={inquiryTitle}
            onChange={(e) => setInquiryTitle(e.target.value)}
            disabled={loading}
          />
          <FormLabel htmlFor="inquiryContent">내용:</FormLabel>
          <FormTextarea
            id="inquiryContent"
            placeholder="문의 내용을 상세하게 입력하세요"
            value={inquiryContent}
            onChange={(e) => setInquiryContent(e.target.value)}
            disabled={loading}
          />
          <SubmitButton
            onClick={handleSubmitInquiry}
            disabled={loading || !inquiryTitle.trim() || !inquiryContent.trim()}
          >
            {loading ? '문의 등록 중...' : '문의 등록'}
          </SubmitButton>
        </InquiryForm>
      )}

      <h4
        style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#1A202C',
          marginTop: '40px',
          marginBottom: '24px',
          borderBottom: '1px solid #EDF2F7',
          paddingBottom: '20px',
        }}
      >
        내 문의 내역
      </h4>
      <InquiryList>
        {inquiries.length > 0 ? (
          inquiries.map((item) => (
            <InquiryItem key={item.id}>
              {!loading && (
                <DeleteButton onClick={() => handleDeleteInquiry(item.id)}>삭제</DeleteButton>
              )}
              <InquiryHeader>
                <h4>{item.title}</h4>
                <span>상태: {item.status}</span>
              </InquiryHeader>
              <InquiryContentDisplay>{item.content}</InquiryContentDisplay>
              <InquiryDate>문의일: {item.date}</InquiryDate>
              {item.answer && (
                <AnswerBox>
                  <p className="answer-label">답변:</p>
                  <p>{item.answer.text}</p>
                  <p className="answer-date">답변일: {item.answer.date}</p>
                </AnswerBox>
              )}
            </InquiryItem>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#718096' }}>아직 등록된 문의가 없습니다.</p>
        )}
      </InquiryList>
    </InquiryContainer>
  );
};

export default Inquiry;
