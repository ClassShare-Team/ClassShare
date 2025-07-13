import styled from 'styled-components';

const BoardCreatePage = () => {
  return (
    <Wrapper>
      <Label>제목</Label>
      <TitleInput placeholder="제목을 입력하세요." />
      <Label>본문</Label>
      <ContentTextArea
        placeholder={`내용을 입력하세요.\n \nClassShare은 상호 존중의 문화를 지향합니다!`}
      />
      <SubmitButton>등록하기</SubmitButton>
    </Wrapper>
  );
};

export default BoardCreatePage;

const Wrapper = styled.div`
  max-width: 800px;
  margin: 60px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.black};
`;

const TitleInput = styled.input`
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const ContentTextArea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.purple};
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
`;
