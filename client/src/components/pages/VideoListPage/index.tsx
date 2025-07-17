import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import './index.css';
import useUserInfo from '@/components/hooks/useUserInfo';

interface Video {
  id: number;
  title: string;
  duration: string;
  is_completed?: boolean;
}

const VideoListPage = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lectureTitle, setLectureTitle] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const navigate = useNavigate();
  const { accessToken } = useUserInfo();

  useEffect(() => {
    if (!accessToken || !lectureId) return;

    fetch(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setLectureTitle(data?.title || '(제목 없음)'))
      .catch((err) => {
        console.error('강의 정보 오류:', err);
        setLectureTitle('(강의 정보를 불러오지 못했습니다)');
      });

    fetch(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}/curriculum`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data: Video[]) => setVideos(data))
      .catch((err) => {
        console.error('커리큘럼 오류:', err);
        setVideos([]);
      });
  }, [lectureId, accessToken]);

  const handleClick = (videoId: number) => {
    navigate(`/streamingpage/${lectureId}?videoId=${videoId}`);
  };

  return (
    <div className="video-list-container">
      <h2 className="video-list-title">{lectureTitle}</h2>
      <div className="video-list">
        {videos.map((video) => (
          <div key={video.id} className="video-card" onClick={() => handleClick(video.id)}>
            <div className="left">
              <span className="icon">🎥</span>
              <span className="title">{video.title}</span>
            </div>
            <div className="right">
              <span className="duration">{video.duration}</span>
              {video.is_completed && <FiCheckCircle className="done-icon" />}
            </div>
          </div>
        ))}
        {videos.length === 0 && (
          <div className="no-video-message">등록된 영상이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default VideoListPage;