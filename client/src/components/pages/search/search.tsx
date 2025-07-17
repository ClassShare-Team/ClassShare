import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import './index.css';

interface Lecture {
  id: number;
  title: string;
  price: number | string;
  thumbnail: string;
  category?: string;
  instructor_nickname?: string;
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
        const apiLectures = data.lectures || [];
        const instructorLectures = data.matched_instructor?.lectures || [];

        // 중복 제거 (강사 강의가 중복될 수 있으니까 id 기준 filter)
        const combinedLectures = [...apiLectures, ...instructorLectures].filter(
          (lec, index, self) => index === self.findIndex((l) => l.id === lec.id)
        );

        setLectures(combinedLectures);
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
    isNaN(Number(p)) ? String(p) : Number(p).toLocaleString() + '원';

  const handlePageChange = (newPage: number) => {
    navigate(`/search?q=${encodeURIComponent(q)}&page=${newPage}`);
  };

  const renderInstructorCard = (inst: Instructor) => (
    <div
      className="instructor-card"
      onClick={() => navigate(`/instructors/${inst.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="instructor-profile-wrapper">
        <img className="instructor-profile" src={inst.profile_image} alt={inst.nickname} />
      </div>
      <div className="instructor-nickname">{inst.nickname}</div>
    </div>
  );

  const renderLectureCard = (lecture: Lecture) => (
    <div
      className="card"
      key={lecture.id}
      onClick={() => navigate(`/lectures/${lecture.id}/apply`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="thumbnail-wrapper">
        <img className="thumbnail" src={lecture.thumbnail} alt={lecture.title} />
      </div>
      <div className="card-content">
        <div className="title ellipsis-multiline">{lecture.title}</div>
        <div className="instructor">{lecture.instructor_nickname || '강사 미정'}</div>
        <div className="price">{fmtPrice(lecture.price)}</div>
      </div>
    </div>
  );

  return (
    <Wrapper>
      <ContentWrapper>
        {matchedInst && (
          <>
            <h2 className="search-title">크리에이터</h2>
            <div className="creator-grid">{renderInstructorCard(matchedInst)}</div>
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
            <div className="lecture-grid">{displayedLectures.map(renderLectureCard)}</div>

            <Page>
              <PageButton disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                〈
              </PageButton>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <PageButton
                  key={pNum}
                  active={pNum === page}
                  onClick={() => handlePageChange(pNum)}
                >
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
      </ContentWrapper>
    </Wrapper>
  );
};

export default SearchPage;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 1271px;
  padding: 0 16px;
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
