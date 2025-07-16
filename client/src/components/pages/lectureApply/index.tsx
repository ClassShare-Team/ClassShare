import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
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

const user = JSON.parse(localStorage.getItem('user') || '{}');
const isLoggedIn = !!user?.id;
const userNickname = user?.nickname || '익명';


function isReview(obj: unknown): obj is Review {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'nickname' in obj &&
    typeof (obj as { nickname?: unknown }).nickname === 'string' &&
    'content' in obj &&
    typeof (obj as { content?: unknown }).content === 'string'
  );
}
function isQna(obj: unknown): obj is Qna {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'nickname' in obj &&
    typeof (obj as { nickname?: unknown }).nickname === 'string' &&
    'content' in obj &&
    typeof (obj as { content?: unknown }).content === 'string'
  );
}

const CreateLecturePage = () => {
  const { id } = useParams<{ id?: string }>();
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewInput, setReviewInput] = useState('');
  const [showQnaModal, setShowQnaModal] = useState(false);
  const [qnaInput, setQnaInput] = useState('');
  const [qnas, setQnas] = useState<Qna[]>([]);
  const [loading, setLoading] = useState(true);


  const API_URL = import.meta.env.VITE_API_URL;
  if (!API_URL) {
    throw new Error('VITE_API_URL 환경변수가 설정되어 있지 않습니다!');
  }

  useEffect(() => {
    if (!id) {
      setLecture(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API_URL}/lectures/${id}`)
      .then(async (res) => {
        const contentType = res.headers.get('content-type');
        const text = await res.text();
        if (!contentType?.includes('application/json')) {
          console.error('서버 응답이 JSON이 아님:', text);
          setLecture(null);
          setLoading(false);
          alert('서버가 올바른 JSON을 반환하지 않았습니다!\n(백엔드가 켜져 있는지, VITE_API_URL이 올바른지 확인하세요.)');
          return;
        }
        try {
          const data = JSON.parse(text);



        const reviews: Review[] = Array.isArray(data.reviews)
          ? data.reviews.map((r: unknown) => {
              if (typeof r === 'string') return { nickname: '익명', content: r };
              if (isReview(r)) return { nickname: r.nickname, content: r.content };
              return { nickname: '익명', content: '' };
            })
          : [];

        const qnas: Qna[] = Array.isArray(data.qnas)
          ? data.qnas.map((q: unknown) => {
              if (typeof q === 'string') return { nickname: '익명', content: q };
              if (isQna(q)) return { nickname: q.nickname, content: q.content };
              return { nickname: '익명', content: '' };
            })
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
        } catch {
          console.error('JSON 파싱 실패:', text);
          setLecture(null);
          alert('서버 응답 파싱에 실패했습니다. (json 에러)');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('강의 불러오기 실패:', err);
        setLecture(null);
        setLoading(false);
        alert('강의 정보를 불러오는 데 실패했습니다.');
      });
  }, [API_URL, id]);

 
  const handleEnroll = async () => {
    if (!isLoggedIn || !lecture) {
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
    } catch (error) {
      console.error('수강 신청 실패:', error);
      alert('수강 신청 중 오류가 발생했습니다.');
    }
  };


  const handleSubmitReview = async () => {
    if (!reviewInput.trim() || !lecture) return;
    try {
      const response = await fetch(`${API_URL}/reviews`, {
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
      const result = await response.json();
      if (response.ok) {
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
      } else {
        alert(result.message || '리뷰 등록 실패');
      }
    } catch (err) {
      console.error('리뷰 등록 오류:', err);
      alert('리뷰 등록 중 오류 발생');
    }
  };

  const handleChangeReview = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_REVIEW_LENGTH) {
      setReviewInput(e.target.value);
    }
  };

 
  const handleSubmitQna = async () => {
    if (!qnaInput.trim() || !lecture) return;
    try {
      const response = await fetch(`${API_URL}/posts`, {
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
      if (response.ok) {
        setQnas((prev) => [...prev, { nickname: userNickname, content: qnaInput.trim() }]);
        setQnaInput('');
        setShowQnaModal(false);
      } else {
        alert('질문 등록 실패');
      }
    } catch (err) {
      console.error('QnA 등록 오류:', err);
      alert('질문 등록 실패');
    }
  };

  const handleChangeQna = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_QNA_LENGTH) {
      setQnaInput(e.target.value);
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
              <strong>무료</strong>
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
