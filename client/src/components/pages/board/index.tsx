import styled from 'styled-components';
import { useState } from 'react';

type SortType = 'recent' | 'accuracy' | 'comments' | 'likes';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  views: number;
  accuracy: number;
}

const dummyPost: Post[] = [
  {
    id: 1,
    title: '저의 첫 게시글입니다',
    content: '저의 첫 게시글의 내용입니다',
    author: '김진수',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    likes: 6,
    comments: 9,
    views: 30,
    accuracy: 0.8,
  },
  {
    id: 2,
    title: '게시판 게시글입니다',
    content: '게시판 게시글의 내용입니다',
    author: '홍길동',
    createdAt: new Date(Date.now() - 46 * 60 * 1000).toISOString(),
    likes: 9,
    comments: 25,
    views: 80,
    accuracy: 0.95,
  },
  {
    id: 3,
    title: 'abc',
    content: 'English_English',
    author: 'Yamal',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    likes: 7,
    comments: 19,
    views: 55,
    accuracy: 0.7,
  },
  {
    id: 4,
    title: '가나다',
    content: '한글_한글',
    author: '이세종',
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    likes: 2,
    comments: 3,
    views: 13,
    accuracy: 0.5,
  },
  {
    id: 5,
    title: '123',
    content: '0102030405',
    author: '숫자맨',
    createdAt: new Date(Date.now() - 2880 * 60 * 1000).toISOString(),
    likes: 31,
    comments: 42,
    views: 108,
    accuracy: 0.99,
  },
  {
    id: 6,
    title: '제목있음',
    content: '내용있음',
    author: '작성자있음',
    createdAt: new Date(Date.now() - 2880 * 60 * 1000).toISOString(),
    likes: 31,
    comments: 42,
    views: 108,
    accuracy: 0.99,
  },
  {
    id: 7,
    title: '지금 시간 새벽 3시 40분',
    content: '20250711',
    author: '0340',
    createdAt: new Date(Date.now() - 2880 * 60 * 1000).toISOString(),
    likes: 31,
    comments: 42,
    views: 108,
    accuracy: 0.99,
  },
  {
    id: 8,
    title: '화이팅',
    content: 'fighting',
    author: '화이팅이용',
    createdAt: new Date(Date.now() - 2880 * 60 * 1000).toISOString(),
    likes: 31,
    comments: 42,
    views: 108,
    accuracy: 0.99,
  },
];

const BoardPage = () => {
  const [sortType, setSortType] = useState<SortType>('recent');

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

  const sortedPost = [...dummyPost].sort((a, b) => {
    if (sortType === 'likes') return b.likes - a.likes;
    if (sortType === 'comments') return b.comments - a.comments;
    if (sortType === 'accuracy') return b.accuracy - a.accuracy;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Container>
      <FilterList>
        <SearchBox>
          <SearchInput placeholder="궁금한 점을 검색해보세요" />
          <TopButton>검색</TopButton>
        </SearchBox>

        <FilterSection>
          <CenterGroup>
            <FilterButtons>
              <FilterCheck>
                <input
                  type="radio"
                  name="sort"
                  checked={sortType === 'recent'}
                  onChange={() => setSortType('recent')}
                />
                <span>최신순</span>
              </FilterCheck>
              <FilterCheck>
                <input
                  type="radio"
                  name="sort"
                  checked={sortType === 'accuracy'}
                  onChange={() => setSortType('accuracy')}
                />
                <span>정확도순</span>
              </FilterCheck>
              <FilterCheck>
                <input
                  type="radio"
                  name="sort"
                  checked={sortType === 'comments'}
                  onChange={() => setSortType('comments')}
                />
                <span>댓글 많은순</span>
              </FilterCheck>
              <FilterCheck>
                <input
                  type="radio"
                  name="sort"
                  checked={sortType === 'likes'}
                  onChange={() => setSortType('likes')}
                />
                <span>좋아요순</span>
              </FilterCheck>
            </FilterButtons>

            <TopButton style={{ marginLeft: '20px' }}>글쓰기</TopButton>
          </CenterGroup>
        </FilterSection>
      </FilterList>

      <PostList>
        {sortedPost.map((post) => (
          <PostItem key={post.id}>
            <PostTitle>{post.title}</PostTitle>
            <PostContent>{post.content}</PostContent>
            <PostInfo>
              <span>
                {post.author} · {getTimeAgo(post.createdAt)}
              </span>
              <InfoRight>
                <span>좋아요 {post.likes}</span>
                <span>댓글 {post.comments}</span>
                <span>조회 {post.views}</span>
              </InfoRight>
            </PostInfo>
          </PostItem>
        ))}
      </PostList>

      <Page>
        <PageButton>〈</PageButton>
        {[1, 2, 3, 4, 5].map((num) => (
          <PageButton key={num} active={num === 3}>
            {num}
          </PageButton>
        ))}
        <PageButton>〉</PageButton>
      </Page>
    </Container>
  );
};

export default BoardPage;

const Container = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 40px 20px;
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
`;
