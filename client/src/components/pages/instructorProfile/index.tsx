import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserProfileLogo from '@/assets/UserProfileLogo.png';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './index.css';

const Index: React.FC = () => {
  const { instructorId } = useParams();

  const [simpleInfo, setSimpleInfo] = useState<any>(null);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);

  const [lectures, setLectures] = useState([]);
  const [lecturePage, setLecturePage] = useState(1);
  const [hasNextLecture, setHasNextLecture] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasNextReview, setHasNextReview] = useState(true);
  const [introduction, setIntroduction] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/instructors/${instructorId}/simple-info`)
      .then((res) => setSimpleInfo(res.data))
      .catch((err) => console.error('강사 간단 정보 조회 실패', err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/instructors/${instructorId}/student-count`)
      .then((res) => setStudentCount(res.data.total_student_count))
      .catch((err) => console.error('수강생 수 조회 실패', err));

    axios
      .get(`${import.meta.env.VITE_API_URL}/instructors/${instructorId}/review-count`)
      .then((res) => setReviewCount(res.data.total_review_count))
      .catch((err) => console.error('리뷰 수 조회 실패', err));
  }, [instructorId]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/instructors/${instructorId}/lectures/paginated?page=${lecturePage}&size=5`
      )
      .then(({ data }) => {
        setLectures(data.lectures);
        setHasNextLecture(data.hasNextPage);
      });
  }, [instructorId, lecturePage]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/instructors/${instructorId}/reviews-with-comments/paginated?page=${reviewPage}&size=5`
      )
      .then(({ data }) => {
        setReviews(data.reviews);
        setHasNextReview(data.hasNextPage);
      });
  }, [instructorId, reviewPage]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/instructors/${instructorId}/instructor-introduction`)
      .then(({ data }) => setIntroduction(data?.introduction ?? null))
      .catch(() => setIntroduction(null));
  }, [instructorId]);

  if (!simpleInfo) return <div>Loading...</div>;

  return (
    <div className="main-wrapper">
      {/* ────────── 프로필 ────────── */}
      <div className="instructor-profile-box">
        <div className="profile-left">
          <img src={simpleInfo.profile_image || UserProfileLogo} className="instructor-profile" />
        </div>
        <div className="profile-right">
          <div className="nickname">{simpleInfo.nickname}</div>
          <div className="stats">
            <div className="stat-item">수강생 수&nbsp;{studentCount}</div>
            <div className="stat-item">수강평 수&nbsp;{reviewCount}</div>
          </div>
          <div className="introduction">
            {introduction ? introduction : '아직 소개글이 없습니다.'}
          </div>
        </div>
      </div>

      {/* ────────── 전체 강의 ────────── */}
      <div className="lecture-header">
        {' '}
        {/* 🔄 제목 + 화살표 한 줄 */}
        <h3>전체 강의</h3>
        <div className="lecture-pagination">
          <button
            disabled={lecturePage === 1}
            onClick={() => setLecturePage((p) => Math.max(1, p - 1))}
          >
            &#60;
          </button>
          <button
            disabled={!hasNextLecture}
            onClick={() => hasNextLecture && setLecturePage((p) => p + 1)}
          >
            &#62;
          </button>
        </div>
      </div>

      <div className="profile-lecture-grid">
        {lectures.map((lec: any) => (
          <div
            className="lec-card"
            key={lec.id}
            onClick={() => navigate(`/lectures/${lec.id}/apply`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="thumbnail-wrapper">
              <img className="thumbnail" src={lec.thumbnail} alt={lec.title} />
            </div>
            <div className="card-content">
              <div className="title">{lec.title}</div>
              <div className="price">
                {parseInt(lec.price) === 0 ? '무료' : `${parseInt(lec.price).toLocaleString()}원`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ────────── 수강평 ────────── */}
      <div className="lecture-header">
        <h3>수강평</h3>
        <div className="lecture-pagination">
          <button
            disabled={reviewPage === 1}
            onClick={() => setReviewPage((p) => Math.max(1, p - 1))}
          >
            &#60;
          </button>
          <button
            disabled={!hasNextReview}
            onClick={() => hasNextReview && setReviewPage((p) => p + 1)}
          >
            &#62;
          </button>
        </div>
      </div>

      <div className="review-wrapper">
        <div className="review-grid">
          {reviews.map((r: any) => (
            <div key={r.id} className="review-item">
              <div className="review-top">
                <span className="review-nickname">{r.student_nickname}</span>
                <span className="review-lecture-title">  {r.lecture_title}</span>
                <span className="review-date">{r.created_at.slice(0, 10)}</span>
              </div>
              <div className="review-content">{r.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
