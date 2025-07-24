import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.css';
import useUserInfo from '@/components/hooks/useUserInfo';
import DefaultProfileImage from '@/assets/UserProfileLogo.png';

interface Review {
  id?: number;
  nickname: string;
  content: string;
  userId?: number;
  comment?: string;
  comment_nickname?: string;
  comment_user_id?: number;
}

interface QnaComment {
  id: number;
  nickname: string;
  content: string;
  user_id: number;
}

interface Qna {
  id?: number;
  nickname: string;
  content: string;
  userId?: number;
  comments?: QnaComment[];
}

interface Lecture {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: string;
  reviews: Review[];
  qnas?: Qna[];
  instructor_nickname?: string;
  instructor_id?: number;
  instructor_profile?: string;
  enrolledUserIds?: number[];
}

const MAX_REVIEW_LENGTH = 300;
const MAX_QNA_LENGTH = 300;

const LectureApplyPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken } = useUserInfo();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [purchaseChecked, setPurchaseChecked] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [reviewReply, setReviewReply] = useState<Record<number, string>>({});
  const [qnaInput, setQnaInput] = useState('');
  const [qnaReplies, setQnaReplies] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

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

        const studentRes = await fetch(`${API_URL}/lectures/${id}/students`);
        const studentData = await studentRes.json();

        setLecture({
          id: Number(data.id),
          title: data.title,
          description: data.description,
          thumbnail: data.thumbnail,
          price: data.price,
          instructor_nickname: data.instructor_nickname,
          instructor_id: data.instructor_id,
          instructor_profile: data.instructor_profile_image || undefined,
          reviews: reviewData.map((r: any) => ({
            id: r.review_id,
            nickname: r.student_nickname,
            content: r.review_content,
            userId: r.student_id,
            comment: r.comment_content,
            comment_nickname: r.instructor_nickname,
            comment_user_id: r.instructor_id,
          })),
          qnas: qnaData.posts
            .filter((q: any) => q.category === 'qa')
            .map((q: any) => ({
              id: q.id,
              nickname: q.user_nickname,
              content: q.title,
              userId: q.user_id,
              comments: q.comments || [],
            })),
          enrolledUserIds: studentData.userIds,
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
      if (!id || !user || !accessToken) return;
      try {
        const res = await fetch(`${API_URL}/lectures/${id}/purchased`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setEnrolled(data.isPurchased === true);
      } catch (err) {
        console.error('수강 여부 확인 실패:', err);
        setEnrolled(false);
      } finally {
        setPurchaseChecked(true);
      }
    };

    fetchPurchaseStatus();
  }, [id, user?.id, accessToken, API_URL, location.key]);

  const handleSubmitReviewComment = async (reviewId: number) => {
    const content = reviewReply[reviewId]?.trim();
    if (!content || !accessToken || !lecture) return;

    try {
      const res = await fetch(`${API_URL}/reviews/${reviewId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                reviews: prev.reviews.map((r) =>
                  r.id === reviewId
                    ? {
                        ...r,
                        comment: content,
                        comment_nickname: user?.nickname,
                        comment_user_id: user?.id,
                      }
                    : r
                ),
              }
            : prev
        );
        setReviewReply((prev) => ({ ...prev, [reviewId]: '' }));
      } else {
        alert('답글 등록 실패');
      }
    } catch {
      alert('답글 등록 오류');
    }
  };

  const handleSubmitQna = async () => {
    const content = qnaInput.trim();
    if (!content || !accessToken || !id) return;
    try {
      const res = await fetch(`${API_URL}/qna/${id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ category: 'qa', title: content }),
      });
      if (res.ok) {
        location.reload();
      } else {
        alert('질문 등록 실패');
      }
    } catch {
      alert('질문 등록 오류');
    }
  };

  const handleSubmitQnaComment = async (postId: number) => {
    const content = qnaReplies[postId]?.trim();
    if (!content || !accessToken) return;
    try {
      const res = await fetch(`${API_URL}/qna/${id}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        location.reload();
      } else {
        alert('답글 등록 실패');
      }
    } catch {
      alert('답글 등록 오류');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lecture) return <div>강의 정보를 불러오지 못했습니다.</div>;

  const price = Math.floor(Number(lecture.price));

  return (
    <div className="lecture-wrapper">
      <div className="lecture-header">
        <img src={lecture.thumbnail} alt="썸네일" className="lecture-thumbnail" />
        <div className="lecture-details">
          <h1>{lecture.title}</h1>
          <p>{lecture.description}</p>
          <p>{price === 0 ? '무료' : `${price.toLocaleString()}원`}</p>
          {!purchaseChecked ? (
            <p>수강 정보 확인 중...</p>
          ) : enrolled ? (
            <button disabled>수강 중</button>
          ) : (
            <button onClick={() => navigate(`/lectures/${id}/payment`)}>수강 신청</button>
          )}
        </div>
      </div>

      <div className="review-section">
        <h2>수강생 리뷰</h2>
        {lecture.reviews.length === 0 ? (
          <p>아직 등록된 리뷰가 없습니다.</p>
        ) : (
          <ul>
            {lecture.reviews.map((r) => (
              <li key={r.id}>
                <strong>{r.nickname}</strong> {r.content}
                {r.comment && (
                  <div style={{ marginLeft: '1rem', fontSize: '14px', color: '#555' }}>
                    <strong>
                      [{
                        r.comment_user_id === lecture.instructor_id
                          ? '강사'
                          : lecture.enrolledUserIds?.includes(r.comment_user_id!)
                          ? '수강생'
                          : '일반'
                      }] {r.comment_nickname}
                    </strong>{' '}
                    {r.comment}
                  </div>
                )}
                {user?.id === r.userId && <button onClick={() => alert('리뷰 삭제 기능')}>삭제</button>}
                {user && !r.comment && (
                  <div>
                    <textarea
                      value={reviewReply[r.id!] || ''}
                      onChange={(e) =>
                        setReviewReply((prev) => ({ ...prev, [r.id!]: e.target.value }))
                      }
                      placeholder="답글 작성"
                    />
                    <button onClick={() => handleSubmitReviewComment(r.id!)}>답글 등록</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="qna-section">
        <h2>Q&A</h2>
        {user && (
          <div>
            <textarea
              value={qnaInput}
              onChange={(e) => setQnaInput(e.target.value)}
              placeholder="질문을 입력하세요"
              maxLength={MAX_QNA_LENGTH}
            />
            <button onClick={handleSubmitQna}>질문 등록</button>
          </div>
        )}
        <ul>
          {lecture.qnas?.map((qna) => (
            <li key={qna.id}>
              <strong>{qna.nickname}</strong> {qna.content}
              <ul>
                {qna.comments?.map((c) => (
                  <li key={c.id} style={{ marginLeft: '1rem' }}>
                    <strong>
                      [{
                        c.user_id === lecture.instructor_id
                          ? '강사'
                          : lecture.enrolledUserIds?.includes(c.user_id)
                          ? '수강생'
                          : '일반'
                      }] {c.nickname}
                    </strong>{' '}
                    {c.content}
                  </li>
                ))}
              </ul>
              {user && (
                <div>
                  <textarea
                    value={qnaReplies[qna.id!] || ''}
                    onChange={(e) =>
                      setQnaReplies((prev) => ({ ...prev, [qna.id!]: e.target.value }))
                    }
                    placeholder="답글 작성"
                  />
                  <button onClick={() => handleSubmitQnaComment(qna.id!)}>답글 등록</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LectureApplyPage;
