import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useUserInfo from '@/components/hooks/useUserInfo';
import './index.css';

interface User {
  id: number;
  nickname: string;
  token: string;
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
  const { user } = useUserInfo() as { user: User | null };

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [qnaInput, setQnaInput] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;
  if (!API_URL) throw new Error('VITE_API_URL 환경변수가 설정되어 있지 않습니다!');

  useEffect(() => {
    const fetchLecture = async () => {
      if (!id) return;
      try {
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
          qnas: qnaData.posts.map((q: any) => ({
            id: q.id,
            nickname: '익명',
            content: q.title,
            userId: q.user_id,
          })),
        });
      } catch (err) {
        console.error(err);
        setLecture(null);
      }
    };

    fetchLecture();
  }, [API_URL, id]);

  useEffect(() => {
    const fetchPurchaseStatus = async () => {
      if (!user || !lecture) return;
      try {
        const res = await fetch(`${API_URL}/lectures/${lecture.id}/purchased`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setEnrolled(data.is_purchased === true);
      } catch (err) {
        console.error('수강 여부 확인 실패:', err);
      }
    };

    fetchPurchaseStatus();
  }, [user, lecture]);

  const handleEnroll = async () => {
    if (!user || !lecture) return alert('로그인이 필요합니다');
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
      alert('수강 신청 오류');
    }
  };

  const price = Math.floor(Number(lecture?.price));

  return (
    <div className="lecture-wrapper">
      <div className="header-bg">
        <div className="title-thumbnail-area">
          <div className="title-area">
            <h1>{lecture?.title}</h1>
          </div>
          <div className="thumbnail-area">
            <img src={lecture?.thumbnail} alt="썸네일" className="thumbnail" />
          </div>
        </div>
      </div>
      <div className="content-area">
        <div className="left-content">
          <div className="description-box">
            <h2>강의 소개</h2>
            <p className="description">{lecture?.description}</p>
          </div>

          <div className="review-section">
            <h2>수강생 리뷰</h2>
            {lecture?.reviews.length === 0 ? (
              <p>아직 등록된 리뷰가 없습니다.</p>
            ) : (
              <ul>
                {lecture?.reviews.map((r, i) => (
                  <li key={i}>
                    <strong>{r.nickname}</strong>: {r.content}
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
              </div>
            )}
          </div>

          <div className="qna-section">
            <h2>Q&A</h2>
            {lecture?.qnas?.length === 0 ? (
              <p>등록된 질문이 없습니다.</p>
            ) : (
              <ul>
                {lecture?.qnas?.map((q, i) => (
                  <li key={i}>
                    <strong>{q.nickname}</strong>: {q.content}
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
              onClick={enrolled ? () => navigate(`/lecture/${lecture?.id}/videos`) : handleEnroll}
              disabled={!user}
              style={{
                background: !user ? '#bbb' : undefined,
                cursor: !user ? 'not-allowed' : undefined,
              }}
            >
              {enrolled ? '수강하기' : '신청하기'}
            </button>
            {!user && (
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