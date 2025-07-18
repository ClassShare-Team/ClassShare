// index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './index.css';

const Index: React.FC = () => {
  const { instructorId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [lectures, setLectures] = useState([]);
  const [lecturePage, setLecturePage] = useState(1);
  const [hasNextLecture, setHasNextLecture] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasNextReview, setHasNextReview] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/instructors/${instructorId}/profile`)
      .then((res) => setProfile(res.data))
      .catch((err) => console.error('강사 프로필 조회 실패', err));
  }, [instructorId]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/instructors/${instructorId}/lectures/paginated?page=${lecturePage}&size=5`
      )
      .then((res) => {
        setLectures(res.data.lectures);
        setHasNextLecture(res.data.hasNextPage);
      });
  }, [instructorId, lecturePage]);

  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/instructors/${instructorId}/reviews-with-comments/paginated?page=${reviewPage}&size=5`
      )
      .then((res) => {
        setReviews(res.data.reviews);
        setHasNextReview(res.data.hasNextPage);
      });
  }, [instructorId, reviewPage]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="main-wrapper">
      {/* 프로필 */}
      <div className="instructor-profile-box">
        <div className="profile-left">
          <img src={profile.profileImage} className="instructor-profile" />
        </div>
        <div className="profile-right">
          <div className="nickname">{profile.nickname}</div>
          <div className="introduction">{profile.introduction}</div>
          <div className="stats">
            <div className="stat-item">수강생 수 {profile.studentCount}</div>
            <div className="stat-item">수강평 수 {profile.reviewCount}</div>
          </div>
        </div>
      </div>

      {/* 강의 */}
      <h3>전체 강의</h3>
      <div className="lecture-grid">
        {lectures.map((lec: any) => (
          <div className="card" key={lec.id}>
            <div className="thumbnail-wrapper">
              <img className="thumbnail" src={lec.thumbnail} alt={lec.title} />
            </div>
            <div className="card-content">
              <div className="title">{lec.title}</div>
              <div className="price">{lec.price === 0 ? '무료' : `${lec.price}원`}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          className={`page-button ${lecturePage === 1 ? 'disabled' : ''}`}
          onClick={() => setLecturePage((prev) => Math.max(1, prev - 1))}
        >
          {'<'}
        </button>
        <button
          className={`page-button ${!hasNextLecture ? 'disabled' : ''}`}
          onClick={() => hasNextLecture && setLecturePage((prev) => prev + 1)}
        >
          {'>'}
        </button>
      </div>

      {/* 수강평 */}
      <h3>수강평</h3>
      <div className="review-grid">
        {reviews.map((review: any) => (
          <div key={review.id} className="review-item">
            <div className="review-nickname">{review.student_nickname}</div>
            <div className="review-content">{review.content}</div>
            <div className="review-date">{review.created_at.slice(0, 10)}</div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          className={`page-button ${reviewPage === 1 ? 'disabled' : ''}`}
          onClick={() => setReviewPage((prev) => Math.max(1, prev - 1))}
        >
          {'<'}
        </button>
        <button
          className={`page-button ${!hasNextReview ? 'disabled' : ''}`}
          onClick={() => hasNextReview && setReviewPage((prev) => prev + 1)}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default Index;
