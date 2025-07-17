import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

interface Lecture {
  id: number;
  title: string;
  price: number | string;
  thumbnail: string;
  category?: string;
}

interface Instructor {
  id: number;
  nickname: string;
  profile_image: string;
  lectures: Lecture[];
}

const categories = ['전체', '교육', '개발', '음악', '요리', '운동', '글쓰기', '예술'];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [matchedInst, setMatchedInst] = useState<Instructor | null>(null);
  const [selectedCat, setSelectedCat] = useState('전체');
  const [totalPages, setTotalPages] = useState(1);

  const page = Number(params.get('page') || '1');
  const q = params.get('q')?.trim() || '';

  useEffect(() => {
    if (!q) return;
    const fetch = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(q)}&page=${page}`;
        const { data } = await axios.get(url);
        setLectures(data.lectures || []);
        setMatchedInst(data.matched_instructor || null);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('검색 실패:', err);
      }
    };
    fetch();
  }, [q, page]);

  const displayedLectures =
    selectedCat === '전체' ? lectures : lectures.filter((l) => l.category === selectedCat);

  const fmtPrice = (p: number | string) =>
    isNaN(Number(p)) ? String(p) : Number(p).toLocaleString();

  const handlePageChange = (newPage: number) => {
    navigate(`/search?q=${encodeURIComponent(q)}&page=${newPage}`);
  };

  return (
    <Wrapper>
      {matchedInst && (
        <>
          <h2 className="search-title">크리에이터</h2>
          <div className="creator-grid">
            <div
              className="instructor-card"
              onClick={() => navigate(`/instructors/${matchedInst.id}`)}
            >
              <div className="instructor-profile-wrapper">
                <img
                  className="instructor-profile"
                  src={matchedInst.profile_image}
                  alt={matchedInst.nickname}
                />
              </div>
              <div className="instructor-content">
                <div className="instructor-nickname">{matchedInst.nickname}</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="search-category-filter">
        {categories.map((c) => (
          <button
            key={c}
            className={`category-btn ${selectedCat === c ? 'active' : ''}`}
            onClick={() => setSelectedCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <h2 className="search-title">강의</h2>
      {displayedLectures.length ? (
        <>
          <div className="lecture-grid">
            {displayedLectures.map((lec) => (
              <div
                key={lec.id}
                className="card"
                onClick={() => navigate(`/lectures/${lec.id}/apply`)}
              >
                <div className="thumbnail-wrapper">
                  <img className="thumbnail" src={lec.thumbnail} alt={lec.title} />
                </div>
                <div className="card-content">
                  <div className="title">{lec.title}</div>
                  <div className="price">{fmtPrice(lec.price)}</div>
                </div>
              </div>
            ))}
          </div>

          <Page>
            <PageButton disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
              〈
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
              <PageButton key={pNum} active={pNum === page} onClick={() => handlePageChange(pNum)}>
                {pNum}
              </PageButton>
            ))}
            <PageButton disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
              〉
            </PageButton>
          </Page>

          <CurrentPageText>현재 {page} 페이지입니다.</CurrentPageText>
        </>
      ) : (
        <div className="empty-search">검색 결과가 없습니다.</div>
      )}
    </Wrapper>
  );
};

export default SearchPage;

/* ---------------- styled-components ---------------- */
const Wrapper = styled.div`
  padding: 40px 16px;
  box-sizing: border-box;
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
