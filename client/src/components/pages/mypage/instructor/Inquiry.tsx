import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify'; // 토스트 메시지를 위해 추가

// --- Styled Components (기존 Inquiry.tsx 와 동일) ---
const InquiryContainer = styled.div`
  padding: 40px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-width: 850px;
  margin: 40px auto;
  font-family: ${({ theme }) => theme.fontFamily};
`;

const Title = styled.h3`
  ${({ theme }) => theme.fonts.h1};
  font-size: 32px;
  margin-bottom: 32px;
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  padding-bottom: 20px;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 32px;
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
  width: 100%;
  font-size: 18px;
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
  padding: 20px;
  padding-right: 100px; /* 삭제 버튼 공간 확보 */
  position: relative;
`;

const InquiryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  h4 {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.black};
  }
  span {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.gray500};
    font-weight: 500;
  }
`;

const InquiryContentDisplay = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  margin-bottom: 12px;
  line-height: 1.6;
`;

const InquiryDate = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  text-align: right;
`;

const AnswerBox = styled.div`
  margin-top: 20px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.gray100};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};

  p {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.gray500};
    line-height: 1.5;
  }
  .answer-label {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.black};
    margin-bottom: 8px;
  }
  .answer-date {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray500};
    text-align: right;
    margin-top: 12px;
  }
`;

const InquiryForm = styled.div`
  margin-top: 30px;
  padding: 30px;
  background-color: ${({ theme }) => theme.colors.gray50};
  border-radius: 12px;
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
  margin-bottom: 20px;
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
  min-height: 150px;
  resize: vertical;
  margin-bottom: 20px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.purple};
    box-shadow: 0 0 0 3px rgba(122, 54, 255, 0.2);
  }
`;

const SubmitButton = styled(NewInquiryButton)`
  margin-top: 0;
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
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 10;

  &:hover {
    background-color: #dc2626;
  }
`;

// --- 문의 데이터 타입 정의 (학생용과 동일) ---
interface InquiryItemType {
  id: number;
  title: string;
  content: string;
  date: string; // "YYYY.MM.DD" 형식
  status: '답변 대기 중' | '답변 완료';
  answer?: {
    // 답변 정보 (운영자가 등록한 답변)
    text: string;
    date: string;
  } | null;
}

// 백엔드 API 응답 타입을 위한 인터페이스
interface InquiryPostResponse {
  message: string;
  inquiryId: number;
}

// 컴포넌트 이름을 파일명에 맞춰 'Inquiry'로 변경
const Inquiry: React.FC = () => {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false); // API 호출 로딩 상태
  const API_URL = import.meta.env.VITE_API_URL; // .env 파일에서 API_URL 가져오기

  // 로컬 스토리지에서 문의 내역을 가져오거나 초기화 (강사용 별도 키 사용)
  const [inquiries, setInquiries] = useState<InquiryItemType[]>(() => {
    const savedInquiries = localStorage.getItem('instructorInquiries');
    return savedInquiries ? JSON.parse(savedInquiries) : [];
  });

  // 문의 내역이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('instructorInquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // 메시지 자동 숨김
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // --- 문의 제출 핸들러 (API 호출 로직) ---
  const handleSubmitInquiry = async () => {
    setMessage(null);
    if (!inquiryTitle.trim() || !inquiryContent.trim()) {
      setMessage({ text: '제목과 내용을 모두 입력해주세요.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/users/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: inquiryTitle,
          content: inquiryContent,
        }),
      });

      if (!res.ok) {
        const errorData: { message?: string } = await res.json(); // 에러 데이터 타입 명시
        throw new Error(errorData.message || '문의 등록에 실패했습니다.');
      }

      const data: InquiryPostResponse = await res.json(); // API 응답 타입 명시
      toast.success('문의가 성공적으로 등록되었습니다.');
      // API에서 반환된 inquiryId를 사용하여 로컬 상태에 추가
      const newInquiry: InquiryItemType = {
        id: data.inquiryId, // 백엔드에서 받은 ID 사용
        title: inquiryTitle,
        content: inquiryContent,
        date: new Date()
          .toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
          .replace(/\. /g, '.')
          .replace(/\.$/, ''),
        status: '답변 대기 중',
        answer: null,
      };
      setInquiries((prev) => [newInquiry, ...prev]); // 새 문의를 목록 맨 앞에 추가

      setInquiryTitle('');
      setInquiryContent('');
      setShowInquiryForm(false);
    } catch (error) {
      // 'error: any' 대신 'error: unknown'으로 변경
      setMessage({
        text: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        type: 'error',
      });
      console.error('Inquiry submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 문의 삭제 핸들러 (API가 없으므로 로컬 스토리지에서만 삭제) ---
  // 백엔드 API가 없기 때문에 로컬에서만 삭제 처리됩니다.
  // 실제 서비스에서는 삭제 API(`DELETE /users/inquiries/:id`)가 필요합니다.
  const handleDeleteInquiry = (id: number) => {
    if (window.confirm('정말로 이 문의를 삭제하시겠습니까? (로컬에서만 삭제됩니다.)')) {
      setLoading(true);
      setTimeout(() => {
        // 비동기 로딩 효과를 주기 위해 setTimeout 사용
        const updatedInquiries = inquiries.filter((inquiry) => inquiry.id !== id);
        setInquiries(updatedInquiries);
        setMessage({ text: '문의가 성공적으로 삭제되었습니다.', type: 'success' });
        setLoading(false);
      }, 300);
    }
  };

  return (
    <InquiryContainer>
      <Title>강사용 1:1 문의</Title> {/* 제목 변경 */}
      <Description>
        운영자에게 문의할 내용을 작성해주세요. 신속하게 답변해 드리겠습니다. {/* 설명 변경 */}
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
        내가 보낸 문의 내역
      </h4>{' '}
      {/* 제목 변경 */}
      <InquiryList>
        {inquiries.length > 0 ? (
          inquiries.map((item) => (
            <InquiryItem key={item.id}>
              {!loading && (
                // ✅ 백엔드 API가 없으므로 로컬에서만 삭제
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
