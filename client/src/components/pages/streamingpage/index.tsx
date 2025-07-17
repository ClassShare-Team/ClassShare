import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiPlay, FiPause } from "react-icons/fi";
import useUserInfo from '@/components/hooks/useUserInfo';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const VideoSection = styled.div`
  flex: 1;
  position: relative;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const VideoArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const ControlsBar = styled.div<{ visible: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: ${({ visible }) => (visible ? "flex" : "none")};
  flex-direction: column;
  padding: 10px;
  background: rgba(0, 0, 0, 0.4);
`;

const ProgressBarWrap = styled.div`
  width: 100%;
  height: 6px;
  background: #444;
  cursor: pointer;
`;

const ProgressBarFill = styled.div<{ percent: number }>`
  width: ${({ percent }) => percent}%;
  height: 100%;
  background: #fff;
`;

const VideoControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 5px 10px;
`;

const ControlLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ControlRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightSidebar = styled.div`
  width: 100%;
  max-height: 40vh;
  background: #f7f7f7;
  padding: 16px;
  overflow-y: auto;
  @media (min-width: 768px) {
    width: 300px;
    max-height: none;
  }
`;

const SidebarTitle = styled.h3`
  margin-bottom: 10px;
`;

const CurriculumList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CurriculumItem = styled.li<{ active: boolean; done: boolean }>`
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: ${({ active }) => (active ? "#ddd" : "#eee")};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${({ done }) => (done ? 0.6 : 1)};
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemStatus = styled.div``;

const ItemTitle = styled.div`
  font-weight: bold;
`;

const ReviewModal = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  width: 300px;
  z-index: 1000;
`;

const StreamingPage = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [searchParams] = useSearchParams();
  const selectedVideoId = searchParams.get("videoId");
  const { accessToken } = useUserInfo();

  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [volume, setVolume] = useState(70);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [isFullscreen] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const barTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/lectures/${lectureId}/curriculum`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        const updated = (res.data?.curriculum || []).map((v: any) => ({
          ...v,
          done: v.is_completed
        }));
        setCurriculum(updated);
        const defaultIndex = selectedVideoId
          ? updated.findIndex((v: any) => v.id === Number(selectedVideoId))
          : 0;
        if (defaultIndex >= 0) {
          setCurrentIdx(defaultIndex);
          setVideoId(updated[defaultIndex].id);
        }
      } catch (err) {
        console.error("커리큘럼 로드 실패", err);
      }
    };
    fetchCurriculum();
  }, [lectureId, selectedVideoId, accessToken]);

  useEffect(() => {
    if (!videoId || !accessToken) return;
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/videos/${videoId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setVideoUrl(res.data.video_url);
      } catch (err) {
        console.error("영상 불러오기 실패", err);
      }
    };
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/videos/${videoId}/progress`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setCurrent(res.data.current_seconds || 0);
      } catch (err) {
        console.error("진도 불러오기 실패", err);
      }
    };
    fetchVideo();
    fetchProgress();
  }, [videoId, accessToken]);

  useEffect(() => {
    const saveProgress = async () => {
      if (!videoId || !accessToken || duration === 0) return;
      try {
        const isCompleted = current >= duration - 3;
        await axios.post(
          `${import.meta.env.VITE_API_URL}/videos/${videoId}/progress`,
          { currentSeconds: current, isCompleted },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        if (isCompleted) {
          setCurriculum(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(v => v.id === videoId);
            if (idx !== -1) updated[idx].done = true;
            return updated;
          });
        }
      } catch (err) {
        console.error("진도 저장 실패", err);
      }
    };
    const interval = setInterval(saveProgress, 10000);
    return () => {
      clearInterval(interval);
      saveProgress();
    };
  }, [videoId, current, duration, accessToken]);

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seek = duration * percent;
    if (videoRef.current) videoRef.current.currentTime = seek;
    setCurrent(seek);
  };

  const handleCurriculumClick = (idx: number) => {
    setCurrentIdx(idx);
    setVideoId(curriculum[idx].id);
    setPaused(true);
    setCurrent(0);
  };

  const handleSubmitReview = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/lectures/${lectureId}/reviews`, {
        content: reviewText,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      alert("수강평이 등록되었습니다.");
      setReviewText("");
      setShowReviewModal(false);
    } catch (err) {
      console.error("리뷰 등록 실패", err);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  return (
    <Wrapper ref={fullscreenRef}>
      <VideoSection>
        <VideoArea onMouseMove={() => {
          if (!isFullscreen) return;
          setShowBar(true);
          if (barTimeout.current) clearTimeout(barTimeout.current);
          barTimeout.current = setTimeout(() => setShowBar(false), 5000);
        }}>
          {videoUrl && (
            <video
              ref={videoRef}
              src={videoUrl}
              controls={false}
              crossOrigin="anonymous"
              onClick={handlePlayToggle}
              onLoadedMetadata={(e) => {
                const videoEl = e.target as HTMLVideoElement;
                setDuration(videoEl.duration);
                setPaused(true);
                videoEl.currentTime = current;
                videoEl.play().catch(err => console.error("Video play failed:", err));
              }}
              onTimeUpdate={() => setCurrent(videoRef.current?.currentTime || 0)}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              style={{ width: "100%", height: "100%", background: "#000" }}
            />
          )}
          <ControlsBar visible={showBar}>
            <ProgressBarWrap onClick={handleProgressClick}>
              <ProgressBarFill percent={duration ? (current / duration) * 100 : 0} />
            </ProgressBarWrap>
            <VideoControlBar>
              <ControlLeft>
                <button onClick={handlePlayToggle} style={{ background: "none", border: "none", color: "#fff" }}>
                  {paused ? <FiPlay /> : <FiPause />}
                </button>
                <div>
                  {Math.floor(current / 60)}:{Math.floor(current % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
                </div>
              </ControlLeft>
              <ControlRight>
                <span>{volume === 0 ? "🔇" : "🔊"}</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => {
                    const newVolume = Number(e.target.value);
                    setVolume(newVolume);
                    if (videoRef.current) {
                      videoRef.current.volume = newVolume / 100;
                      videoRef.current.muted = newVolume === 0;
                    }
                  }}
                  style={{ width: "80px" }}
                />
                <button
                  onClick={() => setShowReviewModal(true)}
                  style={{
                    marginLeft: "10px",
                    background: "none",
                    border: "1px solid #fff",
                    color: "#fff",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  🗨️ 수강평
                </button>
              </ControlRight>
            </VideoControlBar>
          </ControlsBar>
        </VideoArea>
      </VideoSection>
      <RightSidebar>
        <SidebarTitle>커리큘럼</SidebarTitle>
        <CurriculumList>
          {curriculum.map((item, idx) => (
            <CurriculumItem
              key={idx}
              active={currentIdx === idx}
              done={item.done}
              onClick={() => handleCurriculumClick(idx)}
            >
              <ItemLeft>
                <ItemStatus>{item.done && <FiCheckCircle />}</ItemStatus>
                <ItemTitle>{item.title}</ItemTitle>
              </ItemLeft>
            </CurriculumItem>
          ))}
        </CurriculumList>
      </RightSidebar>

      {showReviewModal && (
        <ReviewModal>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={4}
            style={{ width: "100%", marginBottom: "8px" }}
            placeholder="수강평을 입력하세요..."
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
            <button onClick={() => setShowReviewModal(false)}>닫기</button>
            <button onClick={handleSubmitReview} disabled={!reviewText.trim()}>작성</button>
          </div>
        </ReviewModal>
      )}
    </Wrapper>
  );
};

export default StreamingPage;
