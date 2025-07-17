import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
import {
  FiCheckCircle,
  FiPlay,
  FiPause,
  FiMaximize2,
} from "react-icons/fi";

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  background: #121212;
`;
const VideoSection = styled.div`
  flex: 1 1 0;
  background: #000;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
const VideoArea = styled.div`
  flex: 1;
  background: #000;
  position: relative;
`;
const ControlsBar = styled.div<{ visible: boolean }>`
  width: 100%;
  background: #161616;
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
  transition: opacity 0.2s;
  z-index: 20;
`;
const ProgressBarWrap = styled.div`
  width: 100%;
  height: 8px;
  background: #222;
  cursor: pointer;
  position: relative;
`;
const ProgressBarFill = styled.div<{ percent: number }>`
  height: 100%;
  background: #19c37d;
  width: ${({ percent }) => percent}%;
  position: absolute;
  left: 0;
  top: 0;
`;
const VideoControlBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px 0 24px;
`;
const ControlLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
`;
const ControlRight = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  color: #bdbdbd;
  font-size: 21px;
`;
const RightSidebar = styled.div`
  width: 340px;
  background: #fff;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #eee;
  overflow-y: auto;
`;
const SidebarTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  padding: 20px 24px 16px 24px;
`;
const CurriculumSection = styled.div`
  padding: 0 24px;
  flex: 1 1 0;
`;
const CurriculumList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const CurriculumItem = styled.li<{ active?: boolean; done?: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 0;
  background: ${({ active }) => (active ? "#e9faf1" : "#fff")};
  border-radius: 10px;
  margin-bottom: 3px;
  font-weight: ${({ active }) => (active ? 700 : 400)};
  cursor: pointer;
`;
const ItemLeft = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;
const ItemStatus = styled.div`
  margin-right: 10px;
  color: #19c37d;
  font-size: 20px;
`;
const ItemTitle = styled.div`
  font-size: 16px;
`;

export const StreamingPage = () => {
  const { lectureId } = useParams<{ lectureId: string }>();
  const [searchParams] = useSearchParams();
  const selectedVideoId = searchParams.get("videoId");

  const [curriculum, setCurriculum] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [volume] = useState(70);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [isFullscreen] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const barTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const res = await axios.get(`/lectures/${lectureId}/curriculum`, { withCredentials: true });
        const curriculumData = Array.isArray(res.data)
          ? res.data
          : res.data.curriculum;

        const updated = curriculumData.map((v: any) => ({ ...v, done: v.is_completed }));
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
  }, [lectureId, selectedVideoId]);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/videos/${videoId}`, { withCredentials: true });
        setVideoUrl(res.data.video_url);
      } catch (err) {
        console.error("영상 불러오기 실패", err);
      }
    };

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`/videos/${videoId}/progress`, { withCredentials: true });
        setCurrent(res.data.current_seconds || 0);
      } catch (err) {
        console.error("진도 불러오기 실패", err);
      }
    };

    fetchVideo();
    fetchProgress();
  }, [videoId]);

  useEffect(() => {
    const saveProgress = async () => {
      if (!videoId) return;
      try {
        const isCompleted = current >= duration - 3;
        await axios.post(
          `/videos/${videoId}/progress`,
          {
            currentSeconds: current,
            isCompleted,
          },
          { withCredentials: true }
        );

        if (isCompleted) {
          setCurriculum(prev => {
            const updated = [...prev];
            const idx = updated.findIndex(v => v.id === videoId);
            if (idx !== -1) updated[idx].done = true;
            return updated;
          });

          if (currentIdx + 1 < curriculum.length) {
            setTimeout(() => {
              setCurrentIdx(currentIdx + 1);
              setVideoId(curriculum[currentIdx + 1].id);
              setCurrent(0);
              setPaused(true);
            }, 2000);
          }
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
  }, [videoId, current, duration, currentIdx, curriculum]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume / 100;
    videoRef.current.muted = volume === 0;
  }, [volume]);

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
              onClick={handlePlayToggle}
              onLoadedMetadata={e => {
                setDuration((e.target as HTMLVideoElement).duration);
                setPaused(true);
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
                <div>{Math.floor(current / 60)}:{Math.floor(current % 60).toString().padStart(2, '0')} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</div>
              </ControlLeft>
              <ControlRight>
                <FiMaximize2 style={{ cursor: "pointer" }} onClick={() => {
                  const el = fullscreenRef.current;
                  if (!document.fullscreenElement && el) el.requestFullscreen();
                  else if (document.fullscreenElement) document.exitFullscreen();
                }} />
              </ControlRight>
            </VideoControlBar>
          </ControlsBar>
        </VideoArea>
      </VideoSection>

      <RightSidebar>
        <SidebarTitle>커리큘럼</SidebarTitle>
        <CurriculumSection>
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
        </CurriculumSection>
      </RightSidebar>
    </Wrapper>
  );
};

export default StreamingPage;
