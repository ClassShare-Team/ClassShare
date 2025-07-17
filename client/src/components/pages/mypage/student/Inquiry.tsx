import { useState, useEffect } from 'react';
import styled from 'styled-components';

// 문의 데이터의 타입을 정의하는 인터페이스
interface InquiryItemType {
  id: number;
  title: string;
  content: string;
  date: string;
  status: '답변 대기 중' | '답변 완료'; // 상태를 명확히 정의
  answer: {
    text: string;
    date: string;
  } | null; // 답변이 없을 수도 있으므로 null 허용
}

// 메시지 데이터의 타입을 정의하는 인터페이스
interface MessageType {
  text: string;
  type: 'success' | 'error';
}

// styled-components 정의 (변경 없음)
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
  padding-right: 100px;
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

const Inquiry = () => {
  const [showInquiryForm, setShowInquiryForm] = useState<boolean>(false);
  const [inquiryTitle, setInquiryTitle] = useState<string>('');
  const [inquiryContent, setInquiryContent] = useState<string>('');
  const [message, setMessage] = useState<MessageType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // InquiryItemType 배열로 타입을 명시
  const [inquiries, setInquiries] = useState<InquiryItemType[]>(() => {
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
      const newInquiry: InquiryItemType = {
        // newInquiry 객체에 InquiryItemType을 명시
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

      setInquiries((prev: InquiryItemType[]) => [newInquiry, ...prev]); // prev의 타입도 명시
      setMessage({ text: '문의가 성공적으로 등록되었습니다.', type: 'success' });
      setInquiryTitle('');
      setInquiryContent('');
      setShowInquiryForm(false);
      setLoading(false);
    }, 500);
  };

  const handleDeleteInquiry = (id: number) => {
    // id 매개변수에 number 타입 명시
    if (window.confirm('정말로 이 문의를 삭제하시겠습니까?')) {
      setLoading(true);
      setTimeout(() => {
        const updatedInquiries = inquiries.filter((inquiry: InquiryItemType) => inquiry.id !== id); // inquiry 매개변수에 InquiryItemType 명시
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

      <NewInquiryButton
        onClick={() => setShowInquiryForm((prev: boolean) => !prev)}
        disabled={loading}
      >
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInquiryTitle(e.target.value)} // 이벤트 객체 타입 명시
            disabled={loading}
          />
          <FormLabel htmlFor="inquiryContent">내용:</FormLabel>
          <FormTextarea
            id="inquiryContent"
            placeholder="문의 내용을 상세하게 입력하세요"
            value={inquiryContent}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInquiryContent(e.target.value)
            } // 이벤트 객체 타입 명시
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
          inquiries.map(
            (
              item: InquiryItemType // map의 item에 타입 명시
            ) => (
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
            )
          )
        ) : (
          <p style={{ textAlign: 'center', color: '#718096' }}>아직 등록된 문의가 없습니다.</p>
        )}
      </InquiryList>
    </InquiryContainer>
  );
};

export default Inquiry;
