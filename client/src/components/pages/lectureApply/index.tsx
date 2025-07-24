import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.css';
import useUserInfo from '@/components/hooks/useUserInfo';

interface Comment {
  id?: number;
  nickname: string;
  content: string;
  userId?: number;
}

interface Review {
  id?: number;
  nickname: string;
  content: string;
  userId?: number;
  comments?: Comment[];
}

interface Qna {
  id: number;
  nickname: string;
  content: string;
  userId: number;
  comments?: Comment[];
  isPurchasedStudent?: boolean;
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
}

const MAX_REVIEW_LENGTH = 300;
const MAX_QNA_LENGTH = 300;
const MAX_COMMENT_LENGTH = 200;

const LectureApplyPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, accessToken } = useUserInfo();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [purchaseChecked, setPurchaseChecked] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [qnaInput, setQnaInput] = useState('');
  const [qnaCommentInputs, setQnaCommentInputs] = useState<{ [key: number]: string }>({});
  const [reviewCommentInputs, setReviewCommentInputs] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLecture = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const lectureRes = await fetch(`${API_URL}/lectures/${id}`);
        const lectureData = await lectureRes.json();

        const reviewRes = await fetch(`${API_URL}/reviews/lectures/${id}`);
        const reviewData = await reviewRes.json();
        const reviews = reviewData.reviews.map((r: any) => ({
          id: r.review_id,
          nickname: r.student_nickname,
          content: r.review_content,
          userId: r.student_id,
          comments: r.comment_id
            ? [{ id: r.comment_id, nickname: r.instructor_nickname, content: r.comment_content, userId: r.instructor_id }]
            : [],
        }));

        const qnaRes = await fetch(`${API_URL}/qna/${id}/posts/with-comments`);
        const qnaData = await qnaRes.json();
        
        const qnas = qnaData.posts.map((q: any) => ({
          id: q.id,
          nickname: q.nickname,
          content: q.title,
          userId: q.user_id,
          comments: q.comments ? q.comments.map((c: any) => ({
            id: c.id,
            nickname: c.nickname,
            content: c.content,
            userId: c.user_id
          })) : [],
          isPurchasedStudent: q.is_purchased_student,
        }));

        setLecture({
          id: Number(lectureData.id),
          title: lectureData.title,
          description: lectureData.description,
          thumbnail: lectureData.thumbnail,
          price: lectureData.price,
          instructor_nickname: lectureData.instructor_nickname,
          instructor_id: lectureData.instructor_id,
          reviews: reviews,
          qnas: qnas,
        });
      } catch (err) {
        console.error(err);
        setLecture(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLecture();
  }, [API_URL, id, location.key]);

  useEffect(() => {
    const fetchPurchaseStatus = async () => {
      if (!accessToken || !id || !user) {
        setPurchaseChecked(true);
        setEnrolled(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/lectures/${id}/purchased`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setEnrolled(data.is_purchased === true);
      } catch (err) {
        console.error('수강 여부 확인 실패:', err);
        setEnrolled(false);
      } finally {
        setPurchaseChecked(true);
      }
    };

    fetchPurchaseStatus();
  }, [accessToken, user, id, API_URL, location.key]);

  const handleEnroll = async () => {
    if (!accessToken || !lecture) {
      alert('로그인이 필요합니다');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/lectures/${lecture.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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

  const handleGoToVideos = () => {
    if (!lecture?.id) return;
    if (!enrolled) {
      alert('수강 중인 사용자만 접근할 수 있습니다.');
      return;
    }
    navigate(`/lecture/${lecture.id}/videos`);
  };

  const handleSubmitReview = async () => {
    if (!reviewInput.trim() || !lecture || !user || !accessToken) return;

    const hasReviewed = lecture.reviews.some((r) => r.userId === user.id);
    if (hasReviewed) {
      alert('이미 리뷰를 작성하셨습니다.');
      return;
    }

    if (!enrolled) {
      alert('수강 신청한 사용자만 리뷰를 작성할 수 있습니다.');
      return;
    }

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
                    comments: [],
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
    if (!qnaInput.trim() || !lecture || !accessToken || !user) return;
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
          category: 'qa'
        }),
      });
      const result = await res.json();
      if (res.ok) {
        const newQnaRole = user?.id === lecture.instructor_id ? '강사' : (enrolled ? '수강생' : '학생');
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                qnas: [
                  ...(prev.qnas || []),
                  {
                    id: result.id,
                    nickname: user.nickname,
                    content: qnaInput.trim(),
                    userId: user.id,
                    comments: [],
                    isPurchasedStudent: newQnaRole === '수강생',
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

  const handleSubmitQnaComment = async (postId: number) => {
    const commentContent = qnaCommentInputs[postId]?.trim();
    if (!commentContent || !user || !accessToken) {
      alert('답글 내용을 입력하거나 로그인해주세요.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/qna/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          postId: postId,
          userId: user.id,
          content: commentContent,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                qnas: prev.qnas?.map((q) =>
                  q.id === postId
                    ? {
                        ...q,
                        comments: [
                          ...(q.comments || []),
                          { id: result.id, nickname: user.nickname, content: commentContent, userId: user.id },
                        ],
                      }
                    : q
                ),
              }
            : prev
        );
        setQnaCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      } else {
        alert(result.message || '답글 등록 실패');
      }
    } catch {
      alert('답글 등록 중 오류 발생');
    }
  };

  const handleDeleteQnaComment = async (postId: number, commentId?: number) => {
    if (!commentId || !accessToken) return;
    try {
      const res = await fetch(`${API_URL}/qna/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                qnas: prev.qnas?.map((q) =>
                  q.id === postId
                    ? { ...q, comments: q.comments?.filter((c) => c.id !== commentId) }
                    : q
                ),
              }
            : prev
        );
      } else {
        alert('답글 삭제 실패');
      }
    } catch {
      alert('답글 삭제 중 오류 발생');
    }
  };

  const handleSubmitReviewComment = async (reviewId: number) => {
    const commentContent = reviewCommentInputs[reviewId]?.trim();
    if (!user || !accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (user.id !== lecture?.instructor_id) {
      alert('강사만 리뷰에 답글을 작성할 수 있습니다.');
      return;
    }

    const existingComment = lecture?.reviews.find(r => r.id === reviewId)?.comments?.[0];
    const method = existingComment ? 'PUT' : 'POST';
    const url = existingComment ? `${API_URL}/reviews/comments/${existingComment.id}` : `${API_URL}/reviews/comments`;

    if (!commentContent && method === 'POST') {
        alert('답글 내용을 입력해주세요.');
        return;
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reviewId: reviewId,
          userId: user.id,
          content: commentContent,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                reviews: prev.reviews.map((r) =>
                  r.id === reviewId
                    ? {
                        ...r,
                        comments: result.id
                          ? [{ id: result.id, nickname: user.nickname, content: commentContent, userId: user.id }]
                          : [],
                      }
                    : r
                ),
              }
            : prev
        );
        setReviewCommentInputs((prev) => ({ ...prev, [reviewId]: '' }));
      } else {
        alert(result.message || `리뷰 답글 ${method === 'POST' ? '등록' : '수정'} 실패`);
      }
    } catch {
      alert(`리뷰 답글 ${method === 'POST' ? '등록' : '수정'} 중 오류 발생`);
    }
  };

  const handleDeleteReviewComment = async (reviewId: number, commentId?: number) => {
    if (!commentId || !accessToken) return;
    try {
      const res = await fetch(`${API_URL}/reviews/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (res.ok) {
        setLecture((prev) =>
          prev
            ? {
                ...prev,
                reviews: prev.reviews.map((r) =>
                  r.id === reviewId
                    ? { ...r, comments: r.comments?.filter((c) => c.id !== commentId) }
                    : r
                ),
              }
            : prev
        );
        setReviewCommentInputs((prev) => ({ ...prev, [reviewId]: '' }));
      } else {
        alert('리뷰 답글 삭제 실패');
      }
    } catch {
      alert('리뷰 답글 삭제 중 오류 발생');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!lecture) return <div>강의 정보를 불러오지 못했습니다.</div>;

  const price = Math.floor(Number(lecture.price));

  const enrollButtonClass = `enroll-btn ${!user || !accessToken ? 'disabled' : ''}`;
  const enrollButtonLoadingClass = `enroll-btn loading-state`;

  return (
    <div className="lecture-wrapper">
      <div className="header-bg">
        <div className="title-thumbnail-area">
          <div className="title-area">
            <h1>{lecture.title}</h1>
            {lecture.instructor_nickname && (
              <p className="instructor-info">
                강사: <strong>{lecture.instructor_nickname}</strong>
              </p>
            )}
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
                {lecture.reviews.map((r) => (
                  <li key={r.id}>
                    <div className="review-item-content">
                        <span>
                            <strong>{r.nickname}</strong> {r.content}
                        </span>
                        {user?.id === r.userId && (
                            <button onClick={() => handleDeleteReview(r.id)}>삭제</button>
                        )}
                    </div>
                    {r.comments && r.comments.length > 0 && (
                      <div className="comments-list">
                        {r.comments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <strong>{comment.nickname} (강사)</strong>: {comment.content}
                            {user?.id === comment.userId && (
                              <button onClick={() => handleDeleteReviewComment(r.id!, comment.id)}>삭제</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {user && user.id === lecture.instructor_id && (
                      <div className="comment-input-area">
                        <textarea
                          value={reviewCommentInputs[r.id!] !== undefined ? reviewCommentInputs[r.id!] : (r.comments && r.comments[0]?.content) || ''}
                          maxLength={MAX_COMMENT_LENGTH}
                          onChange={(e) =>
                            setReviewCommentInputs((prev) => ({
                              ...prev,
                              [r.id!]: e.target.value,
                            }))
                          }
                          placeholder={r.comments && r.comments.length > 0 ? "답글 수정" : "답글을 작성해주세요."}
                        />
                        <button onClick={() => handleSubmitReviewComment(r.id!)}>
                          {r.comments && r.comments.length > 0 ? '답글 수정' : '답글 등록'}
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {user && enrolled && (
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
                {lecture.qnas?.map((q) => (
                  <li key={q.id}>
                    <div className="qna-item-content">
                        <span>
                            <strong>
                            {q.nickname} (
                            {user?.id === lecture.instructor_id
                                ? '강사'
                                : q.isPurchasedStudent
                                ? '수강생'
                                : '학생'}
                            )
                            </strong>{' '}
                            {q.content}
                        </span>
                        {user?.id === q.userId && (
                            <button onClick={() => handleDeleteQna(q.id)}>삭제</button>
                        )}
                    </div>
                    {q.comments && q.comments.length > 0 && (
                      <div className="comments-list">
                        {q.comments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <strong>{comment.nickname}</strong>: {comment.content}
                            {user?.id === comment.userId && (
                              <button onClick={() => handleDeleteQnaComment(q.id!, comment.id)}>삭제</button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {user && (
                      <div className="comment-input-area">
                        <textarea
                          value={qnaCommentInputs[q.id!] || ''}
                          maxLength={MAX_COMMENT_LENGTH}
                          onChange={(e) =>
                            setQnaCommentInputs((prev) => ({
                              ...prev,
                              [q.id!]: e.target.value,
                            }))
                          }
                          placeholder="답글을 작성해주세요."
                        />
                        <button onClick={() => handleSubmitQnaComment(q.id!)}>답글 등록</button>
                      </div>
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
            {purchaseChecked ? (
              <button
                className={enrolled ? enrollButtonClass : enrollButtonClass}
                onClick={enrolled ? handleGoToVideos : handleEnroll}
                disabled={!user || !accessToken}
              >
                {enrolled ? '수강하기' : '신청하기'}
              </button>
            ) : (
              <div
                className={enrollButtonLoadingClass}
              >
                확인 중...
              </div>
            )}
            {!user || !accessToken ? (
              <div className="login-prompt">
                로그인 후 신청할 수 있습니다.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureApplyPage;