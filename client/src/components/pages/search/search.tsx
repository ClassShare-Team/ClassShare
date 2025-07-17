import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './search.css';

/* ---------- 타입 ---------- */
interface Lecture {
  id: number;
  title: string;
  price: number | string;
  thumbnail: string;
  category?: string; // 서비스 쿼리에 category 포함 권장
}
interface Instructor {
  id: number;
  nickname: string;
  profile_image: string;
  lectures: Lecture[];
}

/* ---------- 상수 ---------- */
const categories = ['전체', '교육', '개발', '음악', '요리', '운동', '글쓰기', '예술'];

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [matchedInst, setMatchedInst] = useState<Instructor | null>(null);
  const [selectedCat, setSelectedCat] = useState('전체');

  /* 검색 API 호출 */
  useEffect(() => {
    const q = params.get('q')?.trim() || '';
    if (!q) return;

    const fetch = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/search?q=${encodeURIComponent(q)}&page=1`;
        const { data } = await axios.get(url);
        setLectures(data.lectures || []);
        setMatchedInst(data.matched_instructor || null);
      } catch (err) {
        console.error('검색 실패:', err);
      }
    };
    fetch();
  }, [params]);

  /* 카테고리 필터링 (강의에만 적용) */
  const displayedLectures =
    selectedCat === '전체' ? lectures : lectures.filter((l) => l.category === selectedCat);

  const fmtPrice = (p: number | string) =>
    isNaN(Number(p)) ? String(p) : Number(p).toLocaleString();

  return (
    <div className="search-wrapper">
      {/* ===== 크리에이터 섹션 ===== */}
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

      {/* ===== 카테고리 필터 (강의 전용) ===== */}
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

      {/* ===== 강의 결과 섹션 ===== */}
      <h2 className="search-title">강의</h2>
      {displayedLectures.length ? (
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
      ) : (
        <div className="empty-search">검색 결과가 없습니다.</div>
      )}
    </div>
  );
};

export default SearchPage;
