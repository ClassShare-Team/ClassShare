import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';

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

const CreateLecturePage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [showQnaModal, setShowQnaModal] = useState(false);
  const [qnaInput, setQnaInput] = useState('');
  const [qnas, setQnas] = useState<Qna[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  if (!API_URL) throw new Error('VITE_API_URL 환경변수가 설정되어 있지 않습니다!');

  useEffect(() => {
    const fetchLectureAndUser = async () => {
      if (!id) {
        setLecture(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        const lectureRes = await fetch(`${API_URL}/lectures/${id}`);
        const contentType = lectureRes.headers.get('content-type');
        const text = await lectureRes.text();
        if (!contentType?.includes('application/json')) throw new Error('강의 JSON 오류');
        const data = JSON.parse(text);

        const reviews: Review[] = Array.isArray(data.reviews)
          ? data.reviews.map((r: any) =>
              typeof r === 'string' ? { nickname: '익명', content: r } : r
            )
          : [];

        const qnas: Qna[] = Array.isArray(data.qnas)
          ? data.qnas.map((q: any) =>
              typeof q === 'string' ? { nickname: '익명', content: q } : q
            )
          : [];

        setLecture({
          id: Number(data.id),
          title: String(data.title ?? ''),
          description: String(data.description ?? ''),
          thumbnail: String(data.thumbnail ?? ''),
          price: String(data.price ?? ''),
          reviews,
          qnas,
        });

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (!storedUser.token) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        const meRes = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          setIsLoggedIn(true);
          setUser({ ...meData, token: storedUser.token });

          const purchasedRes = await fetch(`${API_URL}/lectures/${id}/purchased`, {
            headers: {
              Authorization: `Bearer ${storedUser.token}`,
            },
          });
          const purchasedData = await purchasedRes.json();
          setEnrolled(purchasedData.is_purchased === true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setLecture(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLectureAndUser();
  }, [API_URL, id]);

  const handleEnroll = async () => {
    if (!isLoggedIn || !lecture || !user) {
      alert('로그인이 필요합니다');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/lectures/${lecture.id}/purchase`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || '수강 신청 완료');
        setEnrolled(true);
      } else {
        alert(data.message || '수강 신청 실패');
      }
    } catch {
      alert('수강 신청 중 오류가 발생했습니다.');
    }
  };

  const handleGoToVideos = () => {
    if (lecture?.id) {
      navigate(`/lecture/${lecture.id}/videos`);
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewInput.trim() || !lecture || !user) return;
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          lectureId: lecture.id,
          userId: user.id,
          rating: 5,
          content: reviewInput.trim(),
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                reviews: [...prev.reviews, { nickname: user.nickname, content: reviewInput.trim() }],
              }
            : prev
        );
        setReviewInput('');
        setShowReviewModal(false);
      } else {
        alert(result.message || '리뷰 등록 실패');
      }
    } catch {
      alert('리뷰 등록 중 오류 발생');
    }
  };

  const handleSubmitQna = async () => {
    if (!qnaInput.trim() || !lecture || !user) return;
    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: `${lecture.title}에 대한 질문`,
          content: qnaInput.trim(),
        }),
      });
      if (res.ok) {
        setQnas((prev) => [...prev, { nickname: user.nickname, content: qnaInput.trim() }]);
        setQnaInput('');
        setShowQnaModal(false);
      } else {
        alert('질문 등록 실패');
      }
    } catch {
      alert('질문 등록 실패');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lecture) return <div>강의 정보를 불러오지 못했습니다.</div>;

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
              onChange={(e) => setReviewInput(e.target.value)}
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
              onChange={(e) => setQnaInput(e.target.value)}
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
                style={{ position: 'absolute', top: 16, right: 24 }}
                onClick={() => setShowReviewModal(true)}
              >
                리뷰 작성하기
              </button>
            )}
            <ul>
              {lecture.reviews.length > 0 ? (
                lecture.reviews.map((review, idx) => (
                  <li key={idx} className="review-item">
                    <span style={{ fontWeight: 600, color: '#6F42C1', marginRight: 8 }}>
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
                style={{ position: 'absolute', top: 16, right: 24 }}
                onClick={() => setShowQnaModal(true)}
              >
                Q&amp;A 작성하기
              </button>
            )}
            <ul>
              {qnas.length > 0 ? (
                qnas.map((qna, idx) => (
                  <li key={idx} className="review-item">
                    <span style={{ fontWeight: 600, color: '#6F42C1', marginRight: 8 }}>
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
              <strong>{lecture.price === '0' ? '무료' : `${lecture.price}원`}</strong>
            </div>
            <button
              className="enroll-btn"
              onClick={enrolled ? handleGoToVideos : handleEnroll}
              disabled={!isLoggedIn}
              style={{
                background: !isLoggedIn ? '#bbb' : undefined,
                cursor: !isLoggedIn ? 'not-allowed' : undefined,
              }}
            >
              {enrolled ? '수강하기' : '신청하기'}
            </button>
            {!isLoggedIn && (
              <div style={{ fontSize: 13, color: '#D32F2F', marginTop: 7 }}>
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