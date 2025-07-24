import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const BoardCreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/boards/posts/${id}`);
          const data = await res.json();
          setTitle(data.post.title);
          setContent(data.post.content);
        } catch (err) {
          console.error('게시글 로딩 실패: ', err);
          alert('게시글 정보를 불러오는 데 실패했습니다.');
          navigate('/boards');
        } finally {
          setLoading(false);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    const method = isEdit ? 'PATCH' : 'POST';
    const url = isEdit
      ? `${import.meta.env.VITE_API_URL}/boards/posts/${id}`
      : `${import.meta.env.VITE_API_URL}/boards/posts`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error(isEdit ? '수정 실패' : '작성 실패');

      alert(isEdit ? '게시글이 수정되었습니다.' : '게시글이 등록되었습니다.');
      navigate('/boards');
    } catch (err) {
      alert('오류 발생: ' + (err as Error).message);
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <Wrapper>
      <Card>
        <Label>제목</Label>
        <Input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Label>본문</Label>
        <Textarea
          placeholder={`내용을 입력하세요\nclassShare은 상호존중을 지향합니다.`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <SubmitButton onClick={handleSubmit}>{isEdit ? '수정' : '등록'}</SubmitButton>
      </Card>
    </Wrapper>
  );
};

export default BoardCreatePage;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, #f4f7fe, #f8faff, #eaf5ff);
`;

const Card = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(49, 72, 187, 0.09);
  padding: 2.5rem;
  max-width: 72rem;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 1rem;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  resize: none;
  height: 200px;
  white-space: pre-line;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.colors.purple100};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.purple};
  }
`;
