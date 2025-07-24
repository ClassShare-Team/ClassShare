import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useUserInfo from '@/components/hooks/useUserInfo';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  created_at: string;
  parent_id: number | null;
}

const BoardPostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserInfo();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyComment, setReplyComment] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);

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

  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/boards/posts/${id}/comments`);
      const data = await res.json();
      setComments(data.comments);
    } catch (err) {
      console.error('댓글 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (post) fetchComments();
  }, [post]);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    const token = localStorage.getItem('accessToken');

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/boards/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ content: comment }),
      });
      setComment('');
      await fetchComments();
      await fetchPost();
      localStorage.setItem('reloadBoard', 'true');
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  const handleReplySubmit = async (commentId: number) => {
    if (!replyComment.trim()) return;
    const token = localStorage.getItem('accessToken');

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/boards/comments/${commentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ content: replyComment }),
      });
      setReplyComment('');
      setActiveReplyId(null);
      await fetchComments();
    } catch (err) {
      console.error('답글 작성 실패: ', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = localStorage.getItem('accessToken');

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/boards/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      fetchComments();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <Main>
          <Loading>로딩 중</Loading>
        </Main>
      </Wrapper>
    );
  }

  if (!post) {
    return (
      <Wrapper>
        <Main>
          <ErrorMsg>게시글을 찾을 수 없습니다.</ErrorMsg>
        </Main>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Main>
        <Content>
          <Title>{post.title}</Title>
          <InfoText>
            <span>{new Date(post.created_at).toLocaleString('ko-KR')} 작성</span>
            <span>{post.author}</span>
          </InfoText>
          <Divider />
          <Body>{post.content}</Body>
          <ButtonGroup>
            <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
            {user?.nickname === post.author && (
              <EditButton onClick={() => navigate(`/boards/edit/${post.id}`)}>수정하기</EditButton>
            )}
          </ButtonGroup>

          <CommentSection>
            {user ? (
              <CommentForm>
                <CommentInput
                  placeholder="댓글을 입력하세요"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <SubmitButton onClick={handleSubmit}>작성</SubmitButton>
              </CommentForm>
            ) : (
              <p style={{ color: '#999', fontSize: '14px', marginBottom: '1rem' }}>
                로그인 후 댓글을 작성할 수 있습니다.
              </p>
            )}

            <CommentList>
              {comments
                .filter((c) => c.parent_id === null)
                .map((parent) => (
                  <div key={parent.id}>
                    <CommentItem>
                      <CommentHeader>
                        <span>{parent.author}</span>
                        <span>{new Date(parent.created_at).toLocaleString('ko-KR')}</span>
                      </CommentHeader>
                      <p>{parent.content}</p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '6px',
                        }}
                      >
                        <button
                          onClick={() =>
                            setActiveReplyId(activeReplyId === parent.id ? null : parent.id)
                          }
                          style={{
                            fontSize: '12px',
                            background: 'none',
                            border: 'none',
                            color: '#555',
                            cursor: 'pointer',
                          }}
                        >
                          ↳ 답글 달기
                        </button>

                        {user?.nickname === parent.author && (
                          <DeleteButton onClick={() => handleDeleteComment(parent.id)}>
                            삭제
                          </DeleteButton>
                        )}
                      </div>

                      {activeReplyId === parent.id && (
                        <div style={{ marginTop: '8px' }}>
                          <textarea
                            value={replyComment}
                            onChange={(e) => setReplyComment(e.target.value)}
                            placeholder="답글을 입력하세요"
                            style={{ width: '100%', minHeight: '60px', marginBottom: '6px' }}
                          />
                          <SubmitButton onClick={() => handleReplySubmit(parent.id)}>
                            작성
                          </SubmitButton>
                        </div>
                      )}
                    </CommentItem>

                    {comments
                      .filter((r) => r.parent_id === parent.id)
                      .map((reply) => (
                        <CommentItem
                          key={reply.id}
                          style={{
                            marginTop: '12px',
                            marginLeft: '20px',
                            marginRight: '20px',
                            backgroundColor: '#f5f5f5',
                            padding: '12px',
                            borderRadius: '8px',
                          }}
                        >
                          <CommentHeader>
                            <span>{reply.author}</span>
                            <span>{new Date(reply.created_at).toLocaleString('ko-KR')}</span>
                          </CommentHeader>
                          <p>{reply.content}</p>
                          {user?.nickname === reply.author && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <DeleteButton onClick={() => handleDeleteComment(reply.id)}>
                                삭제
                              </DeleteButton>
                            </div>
                          )}
                        </CommentItem>
                      ))}
                  </div>
                ))}
            </CommentList>
          </CommentSection>
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
  min-height: 900px;
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

const ButtonGroup = styled.div`
  position: absolute;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  gap: 12px;
  flex-wrap: nowrap;
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
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.purple};
  }
`;

const EditButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.gray300};
  color: ${({ theme }) => theme.colors.black};
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;

const CommentSection = styled.div`
  margin-top: 2rem;
`;

const CommentForm = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
`;

const CommentInput = styled.textarea`
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  resize: none;
`;

const SubmitButton = styled.button`
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.purple100};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.purple};
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  background: #f5f5f5;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: 4px;
`;

const DeleteButton = styled.button`
  font-size: 12px;
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  align-self: flex-end;

  &:hover {
    text-decoration: underline;
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
