import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

const BoardPostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/boards/posts/${id}`);
        const data = await res.json();
        setPost(data.post);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading)
    return (
      <Wrapper>
        <Main>
          <Loading>로딩 중...</Loading>
        </Main>
      </Wrapper>
    );
  if (!post)
    return (
      <Wrapper>
        <Main>
          <ErrorMsg>게시글을 찾을 수 없습니다.</ErrorMsg>
        </Main>
      </Wrapper>
    );

  return (
    <Wrapper>
      <Main>
        <Content>
          <Title>{post.title}</Title>
          <InfoText>
            <span>{new Date(post.created_at).toLocaleString()} 작성</span>
            <span>{post.author}</span>
          </InfoText>
          <Divider />
          <Body>{post.content}</Body>
          <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
        </Content>
      </Main>
    </Wrapper>
  );
};

export default BoardPostDetailPage;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to bottom, #fef7ff, #f0f9ff);
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  background: linear-gradient(to bottom, #fef7ff, #f0f9ff);
`;

const Content = styled.div`
  position: relative;
  max-width: 800px;
  min-height: 1200px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const InfoText = styled.p`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray400};
`;

const Divider = styled.hr`
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.gray100};
`;

const Body = styled.div`
  font-size: 16px;
  line-height: 1.6;
  white-space: pre-wrap;
`;

const BackButton = styled.button`
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.purple100};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.purple};
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
`;

const ErrorMsg = styled.div`
  text-align: center;
  padding: 4rem;
  color: red;
`;
