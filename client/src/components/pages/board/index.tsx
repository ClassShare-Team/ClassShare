import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type SortType = 'recent' | 'accuracy' | 'comments' | 'likes';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
  likes: number;
  comments: number;
  views: number;
}

const BoardPage = () => {
  const [sortType, setSortType] = useState<SortType>('recent');
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const postsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const pageGroupSize = 5;
  const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);
  const pageGroupStart = currentGroup * pageGroupSize + 1;

  const getTimeAgo = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/board/posts?sort=${sortType}&search=${searchQuery}`
      );
      const data = await res.json();
      setPosts(data.posts);
      setCurrentPage(1);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortType]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const paginatedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  const pageButtons = Array.from({ length: pageGroupSize }, (_, i) => pageGroupStart + i);

  return (
    <PageWrapper>
      <MainContent>
        <BoardContainer>
          <FormCard>
            <FilterList>
              <SearchBox>
                <SearchInput
                  placeholder="궁금한 점을 검색해보세요"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <TopButton onClick={fetchPosts}>검색</TopButton>
              </SearchBox>
              <FilterSection>
                <CenterGroup>
                  <FilterButtons>
                    {(['recent', 'accuracy', 'comments', 'likes'] as SortType[]).map((type) => (
                      <FilterCheck key={type}>
                        <input
                          type="radio"
                          name="sort"
                          checked={sortType === type}
                          onChange={() => setSortType(type)}
                        />
                        <span>
                          {type === 'recent'
                            ? '최신순'
                            : type === 'accuracy'
                              ? '정확도순'
                              : type === 'comments'
                                ? '댓글 많은순'
                                : '좋아요순'}
                        </span>
                      </FilterCheck>
                    ))}
                  </FilterButtons>
                  <TopButton
                    style={{ marginLeft: '20px' }}
                    onClick={() => navigate('/boards/create')}
                  >
                    글쓰기
                  </TopButton>
                </CenterGroup>
              </FilterSection>
            </FilterList>

            <PostList>
              {paginatedPosts.length > 0
                ? paginatedPosts.map((post) => (
                    <PostItem key={post.id}>
                      <PostTitle>{post.title}</PostTitle>
                      <PostContent>{post.content}</PostContent>
                      <PostInfo>
                        <span>
                          {post.author} · {getTimeAgo(post.created_at)}
                        </span>
                        <InfoRight>
                          <span>좋아요 {post.likes}</span>
                          <span>댓글 {post.comments}</span>
                          <span>조회 {post.views ?? 0}</span>
                        </InfoRight>
                      </PostInfo>
                    </PostItem>
                  ))
                : Array.from({ length: 10 }).map((_, i) => (
                    <PostItem key={i} className="placeholder" />
                  ))}
            </PostList>

            <Page>
              <PageButton disabled={currentPage === 1} onClick={handlePrevPage}>
                〈
              </PageButton>
              {pageButtons.map((num) => (
                <PageButton
                  key={num}
                  active={currentPage === num}
                  onClick={() => {
                    if (num <= totalPages) handlePageChange(num);
                  }}
                  disabled={num > totalPages}
                >
                  {num}
                </PageButton>
              ))}
              <PageButton disabled={currentPage === totalPages} onClick={handleNextPage}>
                〉
              </PageButton>
            </Page>

            <CurrentPageText>현재 {currentPage} 페이지입니다.</CurrentPageText>
          </FormCard>
        </BoardContainer>
      </MainContent>
    </PageWrapper>
  );
};

export default BoardPage;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f4f7fe, #f8faff, #eaf5ff);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const BoardContainer = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  flex: 1;
  width: 100%;
  padding: 2.5rem 1.5rem;
  display: flex;
`;

const FormCard = styled.section`
  flex: 1;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(49, 72, 187, 0.09);
  padding: 2.5rem;
  margin-left: 1.5rem;
  width: 100%;
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const SearchBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const SearchInput = styled.input`
  width: 500px;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  background-color: #fcfcfc;
  text-align: center;
  outline: none;
  font-size: 15px;
`;

const TopButton = styled.button`
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.colors.purple100};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: ${({ theme }) => theme.colors.purple};
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
`;

const CenterGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterButtons = styled.div`
  display: flex;
  width: 500px;
  justify-content: space-between;
  margin: 0 auto;
`;

const FilterCheck = styled.label<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
  user-select: none;

  input[type='radio'] {
    appearance: none;
    width: 16px;
    height: 16px;
    border: 2px solid ${({ theme }) => theme.colors.gray400};
    border-radius: 4px;
    position: relative;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:checked {
      background-color: ${({ theme }) => theme.colors.purple};
      border-color: ${({ theme }) => theme.colors.purple};
    }

    &:checked::after {
      content: '';
      position: absolute;
      width: 3px;
      height: 6px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PostItem = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  padding-bottom: 16px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #fcfcfc;
  }

  &.placeholder {
    height: 80px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray400};
    background-color: transparent;
    opacity: 0.3;
    pointer-events: none;
  }
`;

const PostTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
`;

const PostContent = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-top: 6px;
`;

const PostInfo = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray400};
  display: flex;
  justify-content: space-between;
`;

const InfoRight = styled.div`
  display: flex;
  gap: 10px;
`;

const Page = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 6px 12px;
  border-radius: 6px;
  background-color: ${({ active, theme }) => (active ? theme.colors.purple : theme.colors.gray200)};
  color: ${({ active }) => (active ? 'white' : 'black')};
  border: none;
  cursor: pointer;
  font-weight: 500;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const CurrentPageText = styled.div`
  text-align: center;
  margin-top: 28px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black};
`;
