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

  const [user, setUser] = useState<User | null>(null);
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [qnaInput, setQnaInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const syncUserData = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser?.id) setUser(parsedUser);
        } catch (e) {
          console.error('유저 파싱 실패');
        }
      }
      setAccessToken(token);
    };

    syncUserData();

    window.addEventListener('storage', syncUserData);
    return () => window.removeEventListener('storage', syncUserData);
  }, []);

  useEffect(() => {
    if (!accessToken) return;
    const userData = localStorage.getItem('user');
    if (!user && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.id) setUser(parsedUser);
      } catch {}
    }
  }, [accessToken]);

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

  useEffect(() => {
    if (lecture && localStorage.getItem(`enrolled_${lecture.id}`) === 'true') {
      setEnrolled(true);
    }
  }, [lecture]);

  const handleGoToVideos = () => {
    if (lecture?.id) navigate(`/lecture/${lecture.id}/videos`);
  };

  // ... 나머지 그대로 유지

  // 마지막 버튼 렌더링 부분만 유지

  return (
    <div className="price-box">
      <div className="price">
        <strong>{Number(lecture?.price) === 0 ? '무료' : `${Number(lecture?.price).toLocaleString()}원`}</strong>
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
  );
};

export default CreateLecturePage;
