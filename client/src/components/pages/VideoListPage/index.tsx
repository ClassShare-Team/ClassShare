import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

interface Video {
  title: string;
  duration: string;
}

const VideoListPage = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [lectureTitle, setLectureTitle] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    // 강의 제목 불러오기
    fetch(`${import.meta.env.VITE_API_URL}/api/lectures/${lectureId}`)
      .then((res) => res.json())
      .then((data) => setLectureTitle(data.title))
      .catch((err) => console.error('강의 정보 오류', err));

    // 커리큘럼(영상 목록) 불러오기
    fetch(`${import.meta.env.VITE_API_URL}/api/lectures/${lectureId}/curriculum`)
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error('커리큘럼 오류', err));
  }, [lectureId]);

  return (
    <div className="video-list-container">
      <h2 className="video-list-title">{lectureTitle}</h2>
      <div className="video-list">
        {videos.map((video, index) => (
          <div key={index} className="video-card">
            <div className="left">
              <span className="icon">🎥</span>
              <span className="title">{video.title}</span>
            </div>
            <div className="order">{video.duration}</div>
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
