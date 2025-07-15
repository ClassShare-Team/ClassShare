import { useEffect, useState } from 'react';
import './index.css';

// 리뷰/QnA 타입
interface Review {
  nickname: string;
  content: string;
}
interface Qna {
  nickname: string;
  content: string;
}
interface Lecture {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  reviews: Review[];
  qnas?: Qna[];
}
const MAX_REVIEW_LENGTH = 300;
const MAX_QNA_LENGTH = 300;
const userNickname = '홍길동';

const isLoggedIn = false;

const CreateLecturePage = () => {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewInput, setReviewInput] = useState('');

  const [showQnaModal, setShowQnaModal] = useState(false);
  const [qnaInput, setQnaInput] = useState('');
  const [qnas, setQnas] = useState<Qna[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/lectures/1')
      .then((res) => res.json())
      .then((data) =>
        setLecture({
          ...data,
          reviews: Array.isArray(data.reviews)
            ? data.reviews.map((r: any) =>
                typeof r === 'string' ? { nickname: '익명', content: r } : r
              )
            : [],
          qnas: Array.isArray(data.qnas)
            ? data.qnas.map((q: any) =>
                typeof q === 'string' ? { nickname: '익명', content: q } : q
              )
            : [],
        })
      )
      .catch((err) => console.error('강의 불러오기 실패:', err));
  }, []);

  const handleSubmitReview = () => {
    if (!reviewInput.trim()) return;
    setLecture((prev) =>
      prev
        ? {
            ...prev,
            reviews: [...prev.reviews, { nickname: userNickname, content: reviewInput.trim() }],
          }
        : prev
    );
    setReviewInput('');
    setShowReviewModal(false);
  };
  const handleChangeReview = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_REVIEW_LENGTH) {
      setReviewInput(e.target.value);
    }
  };

  const handleSubmitQna = () => {
    if (!qnaInput.trim()) return;
    setQnas((prev) => [...prev, { nickname: userNickname, content: qnaInput.trim() }]);
    setQnaInput('');
    setShowQnaModal(false);
  };
  const handleChangeQna = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_QNA_LENGTH) {
      setQnaInput(e.target.value);
    }
  };

  const handleEnroll = () => {
    if (!isLoggedIn) {
      alert('로그인이 필요합니다');
      return;
    }
    setEnrolled(true);
  };

  if (!lecture) return <div>Loading...</div>;

  return (
    <div className="lecture-wrapper">
      {showReviewModal && (
        <div className="modal-bg" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-submit-btn"
              onClick={handleSubmitReview}
              disabled={!reviewInput.trim()}
            >
              작성하기
            </button>
            <h3 className="modal-title">리뷰 작성</h3>
            <textarea
              className="modal-textarea"
              placeholder="리뷰를 입력해 주세요 (최대 300자)"
              value={reviewInput}
              onChange={handleChangeReview}
              maxLength={MAX_REVIEW_LENGTH}
              autoFocus
            />
            <div className="modal-count">
              {reviewInput.length}/{MAX_REVIEW_LENGTH}
            </div>
          </div>
        </div>
      )}

      {showQnaModal && (
        <div className="modal-bg" onClick={() => setShowQnaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-submit-btn"
              onClick={handleSubmitQna}
              disabled={!qnaInput.trim()}
            >
              작성하기
            </button>
            <h3 className="modal-title">Q&amp;A 작성</h3>
            <textarea
              className="modal-textarea"
              placeholder="질문을 입력해 주세요 (최대 300자)"
              value={qnaInput}
              onChange={handleChangeQna}
              maxLength={MAX_QNA_LENGTH}
              autoFocus
            />
            <div className="modal-count">
              {qnaInput.length}/{MAX_QNA_LENGTH}
            </div>
          </div>
        </div>
      )}

      <div className="header-bg">
        <div className="title-thumbnail-area">
          <div className="title-area">
            <h1>{lecture.title}</h1>
          </div>
          <div className="thumbnail-area">
            <img src={lecture.thumbnail} alt="썸네일" className="thumbnail" />
          </div>
        </div>
      </div>
      <div className="content-area">
        <div className="left-content">
          <div className="description-box">
            <h2>강의 소개</h2>
            <p className="description">{lecture.description}</p>
          </div>

          <div className="review-box" style={{ position: 'relative' }}>
            <strong>리뷰</strong>
            {enrolled && (
              <button
                className="enroll-btn"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 24,
                  padding: '6px 16px',
                  fontSize: '14px',
                  zIndex: 1,
                }}
                onClick={() => setShowReviewModal(true)}
              >
                리뷰 작성하기
              </button>
            )}
            <ul>
              {lecture.reviews && lecture.reviews.length > 0 ? (
                lecture.reviews.map((review, idx) => (
                  <li key={idx} className="review-item">
                    <span style={{ fontWeight: 600, color: '#6f42c1', marginRight: 8 }}>
                      {review.nickname}
                    </span>
                    {review.content}
                  </li>
                ))
              ) : (
                <p style={{ color: '#666', marginLeft: '2px' }}>리뷰가 없습니다.</p>
              )}
            </ul>
          </div>

          <div className="review-box" style={{ position: 'relative', marginTop: '30px' }}>
            <strong>Q&amp;A</strong>
            {enrolled && (
              <button
                className="enroll-btn"
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 24,
                  padding: '6px 16px',
                  fontSize: '14px',
                  zIndex: 1,
                }}
                onClick={() => setShowQnaModal(true)}
              >
                Q&amp;A 작성하기
              </button>
            )}
            <ul>
              {qnas && qnas.length > 0 ? (
                qnas.map((qna, idx) => (
                  <li key={idx} className="review-item">
                    <span style={{ fontWeight: 600, color: '#6f42c1', marginRight: 8 }}>
                      {qna.nickname}
                    </span>
                    {qna.content}
                  </li>
                ))
              ) : (
                <p style={{ color: '#666', marginLeft: '2px' }}>Q&amp;A가 없습니다.</p>
              )}
            </ul>
          </div>
        </div>
        <div className="right-content">
          <div className="price-box">
            <div className="price">
              <strong>무료 </strong>
            </div>
            <button
              className="enroll-btn"
              onClick={handleEnroll}
              disabled={enrolled}
              style={{
                background: !isLoggedIn ? '#bbb' : undefined,
                cursor: !isLoggedIn ? 'not-allowed' : undefined,
              }}
            >
              {enrolled ? '수강하기' : '신청하기'}
            </button>
            {!isLoggedIn && (
              <div style={{ fontSize: 13, color: '#d32f2f', marginTop: 7 }}>
                로그인 후 신청할 수 있습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecturePage;
