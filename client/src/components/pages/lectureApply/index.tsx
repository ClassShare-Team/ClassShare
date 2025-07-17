import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './index.css';

interface User {
  id: number;
  nickname: string;
}

interface Review {
  id?: number;
  nickname: string;
  content: string;
  userId?: number;
}

interface Qna {
  id?: number;
  nickname: string;
  content: string;
  userId?: number;
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

  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [qnaInput, setQnaInput] = useState('');
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const syncUserData = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.id) setUser(parsedUser);
        } catch {
          console.error('유저 파싱 실패');
        }
      }
      setAccessToken(token);
    };

    window.addEventListener('storage', syncUserData);
    return () => window.removeEventListener('storage', syncUserData);
  }, []);

  useEffect(() => {
    const fetchLecture = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const lectureRes = await fetch(`${API_URL}/lectures/${id}`);
        const data = await lectureRes.json();

        const reviewRes = await fetch(`${API_URL}/reviews/lectures/${id}`);
        const reviewData = await reviewRes.json();

        const qnaRes = await fetch(`${API_URL}/qna/${id}/posts`);
        const qnaData = await qnaRes.json();

        setLecture({
          id: Number(data.id),
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          price: data.price,
          reviews: reviewData.reviews.map((r: any) => ({
            id: r.review_id,
            nickname: r.student_nickname,
            content: r.review_content,
            userId: r.student_id,
          })),
          qnas: qnaData.posts
            .filter((q: any) => q.category === 'qa')
            .map((q: any) => ({
              id: q.id,
              nickname: q.user_nickname,
              content: q.title,
              userId: q.user_id,
            })),
        });
      } catch (err) {
        console.error(err);
        setLecture(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [API_URL, id]);

  useEffect(() => {
    const fetchPurchaseStatus = async () => {
      if (!accessToken || !id) return;
      try {
        const res = await fetch(`${API_URL}/lectures/${id}/purchased`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setEnrolled(data.is_purchased === true);
      } catch (err) {
        console.error('수강 여부 확인 실패:', err);
      }
    };

    fetchPurchaseStatus();
  }, [accessToken, id]);

  useEffect(() => {
    if (lecture && localStorage.getItem(`enrolled_${lecture.id}`) === 'true') {
      setEnrolled(true);
    }
  }, [lecture]);

  const handleEnroll = async () => {
    if (!accessToken || !lecture) return alert('로그인이 필요합니다');
    try {
      const res = await fetch(`${API_URL}/lectures/${lecture.id}/purchase`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || '수강 신청 완료');
        setEnrolled(true);
        localStorage.setItem(`enrolled_${lecture.id}`, 'true');
      } else {
        alert(data.message || '수강 신청 실패');
      }
    } catch {
      alert('수강 신청 오류');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewInput.trim() || !lecture || !user || !accessToken) return;
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          lectureId: lecture.id,
          userId: user.id,
          content: reviewInput.trim(),
          rating: 5,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                reviews: [
                  ...prev.reviews,
                  {
                    id: result.id,
                    nickname: user.nickname,
                    content: reviewInput.trim(),
                    userId: user.id,
                  },
                ],
              }
            : prev
        );
        setReviewInput('');
      } else {
        alert(result.message || '리뷰 등록 실패');
      }
    } catch {
      alert('리뷰 등록 중 오류 발생');
    }
  };

  const handleDeleteReview = async (reviewId?: number) => {
    if (!reviewId || !accessToken) return;
    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        setLecture((prev) =>
          prev ? { ...prev, reviews: prev.reviews.filter((r) => r.id !== reviewId) } : prev
        );
      } else {
        alert('삭제 실패');
      }
    } catch {
      alert('삭제 중 오류 발생');
    }
  };

  const handleSubmitQna = async () => {
    if (!qnaInput.trim() || !lecture || !accessToken) return;
    try {
      const res = await fetch(`${API_URL}/qna`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          lecture_id: lecture.id,
          title: qnaInput.trim(),
          content: '내용 없음',
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                qnas: [
                  ...(prev.qnas || []),
                  {
                    id: result.postId,
                    nickname: user?.nickname || '익명',
                    content: qnaInput.trim(),
                    userId: user?.id,
                  },
                ],
              }
            : prev
        );
        setQnaInput('');
      } else {
        alert(result.message || '질문 등록 실패');
      }
    } catch {
      alert('질문 등록 실패');
    }
  };

  const handleDeleteQna = async (qnaId?: number) => {
    if (!qnaId || !accessToken) return;
    try {
      const res = await fetch(`${API_URL}/qna/posts/${qnaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        setLecture((prev) =>
          prev ? { ...prev, qnas: prev.qnas?.filter((q) => q.id !== qnaId) } : prev
        );
      } else {
        alert('삭제 실패');
      }
    } catch {
      alert('삭제 중 오류 발생');
    }
  };

  const handleGoToVideos = () => {
    if (lecture?.id) navigate(`/lecture/${lecture.id}/videos`);
  };

  if (loading) return <div>Loading...</div>;
  if (!lecture) return <div>강의 정보를 불러오지 못했습니다.</div>;

  const price = Math.floor(Number(lecture.price));

  return (
    <div className="lecture-wrapper">
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

          <div className="review-section">
            <h2>수강생 리뷰</h2>
            {lecture.reviews.length === 0 ? (
              <p>아직 등록된 리뷰가 없습니다.</p>
            ) : (
              <ul>
                {lecture.reviews.map((r, i) => (
                  <li key={i}>
                    <span><strong>{r.nickname}</strong> {r.content}</span>
                    {user?.id === r.userId && (
                      <button onClick={() => handleDeleteReview(r.id)}>삭제</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {user && (
              <div className="review-input">
                <textarea
                  value={reviewInput}
                  maxLength={MAX_REVIEW_LENGTH}
                  onChange={(e) => setReviewInput(e.target.value)}
                  placeholder="리뷰를 작성해주세요."
                />
                <button onClick={handleSubmitReview}>리뷰 등록</button>
              </div>
            )}
          </div>

          <div className="qna-section">
            <h2>Q&A</h2>
            {lecture.qnas?.length === 0 ? (
              <p>등록된 질문이 없습니다.</p>
            ) : (
              <ul>
                {lecture.qnas?.map((q, i) => (
                  <li key={i}>
                    <span><strong>{q.nickname}</strong> {q.content}</span>
                    {user?.id === q.userId && (
                      <button onClick={() => handleDeleteQna(q.id)}>삭제</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {user && (
              <div className="qna-input">
                <textarea
                  value={qnaInput}
                  maxLength={MAX_QNA_LENGTH}
                  onChange={(e) => setQnaInput(e.target.value)}
                  placeholder="질문을 작성해주세요."
                />
                <button onClick={handleSubmitQna}>질문 등록</button>
              </div>
            )}
          </div>
        </div>

        <div className="right-content">
          <div className="price-box">
            <div className="price">
              <strong>{price === 0 ? '무료' : `${price.toLocaleString()}원`}</strong>
            </div>
            <button
              className="enroll-btn"
              onClick={enrolled ? handleGoToVideos : handleEnroll}
              disabled={!user || !accessToken}
              style={{
                background: !user || !accessToken ? '#bbb' : undefined,
                cursor: !user || !accessToken ? 'not-allowed' : undefined,
              }}
            >
              {enrolled ? '수강하기' : '신청하기'}
            </button>
            {!user || !accessToken ? (
              <div style={{ fontSize: 13, color: '#D32F2F', marginTop: 7 }}>
                로그인 후 신청할 수 있습니다.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecturePage;
