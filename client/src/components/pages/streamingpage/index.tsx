import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import {
  FiCheckCircle,
  FiDownload,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiPause,
  FiSettings,
  FiMaximize2,
  FiCamera,
  FiShare2,
} from "react-icons/fi";
import { MdSlowMotionVideo } from "react-icons/md";
import { BsChevronLeft, BsChevronRight, BsChatLeftText } from "react-icons/bs";

// styled-components ----------------
const TopBar = styled.div`
  width: 100%;
  height: 44px;
  background: #191b1d;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
`;
const TopBarBack = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 18px;
`;
const TopBarTitle = styled.div`
  color: #fff;
  font-size: 18px;
  font-weight: 600;
`;
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
const ControlsBarStatic = styled.div`
  width: 100%;
  background: #161616;
  position: absolute;
  left: 0;
  bottom: 0;
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
`;
const VolumeWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 12px;
  cursor: pointer;
`;
/* VolumePopup: 위치를 progressBar보다 위쪽으로 */
const VolumePopup = styled.div`
  position: absolute;
  bottom: 42px;  /* 높여서 진행바 위로 */
  left: 0;
  background: #232323;
  border-radius: 10px;
  display: flex;
  align-items: center;
  z-index: 22;
  padding: 10px 12px;
  box-shadow: 0 2px 8px rgba(30,30,30,0.16);
`;
const VolumeSlider = styled.input`
  width: 90px;
  height: 4px;
  accent-color: #fff;
  margin: 0 8px;
  background: #fff;
`;
const ControlRight = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  color: #bdbdbd;
  font-size: 21px;
`;
const BottomBar = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 24px 8px 24px;
  background: #161616;
`;
const NaviButton = styled.button`
  display: flex;
  align-items: center;
  background: #232323;
  color: #fff;
  border: none;
  border-radius: 22px;
  font-size: 15px;
  padding: 6px 22px;
  margin-right: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;
  &:hover {
    background: #1a1a1a;
  }
`;
const ReviewButton = styled.button`
  display: flex;
  align-items: center;
  background: #232323;
  color: #ffe18e;
  border: none;
  border-radius: 22px;
  font-size: 15px;
  padding: 6px 22px;
  margin-right: 14px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;
  &:hover {
    background: #1a1a1a;
  }
`;
const Spacer = styled.div`
  flex: 1;
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
const ItemButton = styled.button`
  background: none;
  border: none;
  color: #767676;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
// 추가 스타일
const Overlay = styled.div`
  position: fixed; left: 0; top: 0; right: 0; bottom: 0;
  z-index: 1001;
`;
const Popup = styled.div`
  position: absolute;
  right: 0;
  bottom: 45px;
  background: #24242a;
  border-radius: 12px;
  padding: 18px 24px 18px 24px;
  min-width: 170px;
  color: #fff;
  box-shadow: 0 4px 16px rgba(30,30,30,0.20);
  z-index: 1002;
  overflow-y: auto;
  max-height: 270px;
`;
const PopupTitle = styled.div`
  font-size: 13px;
  color: #a9a9b4;
  margin-bottom: 14px;
  text-align: center;
`;
const PlaybackSlider = styled.input`
  width: 120px; margin: 0 0 12px 0; accent-color: #fff;
`;
const PlaybackValue = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: #ffe18e;
`;
const SettingsModal = styled.div`
  position: absolute;
  right: 40px;
  bottom: 45px;
  background: #24242a;
  border-radius: 12px;
  padding: 18px 24px;
  min-width: 170px;
  color: #fff;
  z-index: 1002;
`;
const SettingsRow = styled.div`
  margin-bottom: 18px;
`;
const Select = styled.select`
  width: 100%; padding: 5px 7px;
  border-radius: 6px;
  background: #232323;
  color: #fff;
  font-size: 16px;
`;

// ================= 데이터 =================
const curriculum = [
  {
    title: "4. 주석과 시작점",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    done: true,
  },
  {
    title: "5. 입력과 출력",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    done: true,
  },
  {
    title: "6. 변수 선언과 출력",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    done: true,
  },
  {
    title: "7. 조건문 (v2)",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    done: true,
  },
  {
    title: "8. 반복문 (v2)",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    done: false,
  },
  {
    title: "9. 비교연산자와 반복문·조건문 문제 풀이 (v2)",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    done: false,
  },
  {
    title: "10. 함수(메서드) 선언과 호출",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    done: false,
  },
  {
    title: "11. 연산자와 기출문제",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    done: false,
  },
  {
    title: "12. switch-case문",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    done: false,
  },
];

const qualityOptions = [
  { value: "auto", label: "자동" },
  { value: "1080p", label: "1080p" },
  { value: "720p", label: "720p" },
  { value: "540p", label: "540p" },
];

export const StreamingPage = () => {
  const [currentIdx, setCurrentIdx] = useState(4);
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBar, setShowBar] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [paused, setPaused] = useState(true);
  const [showPlayback, setShowPlayback] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [quality, setQuality] = useState("auto");
  const [showCaptureAlert, setShowCaptureAlert] = useState(false);

  const fullscreenRef = useRef<HTMLDivElement>(null);
  const barTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 볼륨 0이면 muted, 아니면 unmuted
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = volume === 0;
    videoRef.current.volume = volume / 100;
  }, [volume]);


  // 전체화면 진입/해제
  const handleFullscreen = () => {
    const elem = fullscreenRef.current;
    if (!document.fullscreenElement && elem) {
      elem.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
  const handleChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
    setShowBar(!document.fullscreenElement); 
  };
  document.addEventListener("fullscreenchange", handleChange);
  return () => document.removeEventListener("fullscreenchange", handleChange);
}, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen && e.key === "Escape") {
        document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isFullscreen && e.button === 0) {
      document.exitFullscreen();
    }
  };

  const handleBarMouseMove = () => {
    if (!isFullscreen) return;
    setShowBar(true);
    if (barTimeout.current) clearTimeout(barTimeout.current);
    barTimeout.current = setTimeout(() => setShowBar(false), 5000);
  };

  useEffect(() => {
    if (!isFullscreen) setShowBar(true);
  }, [isFullscreen]);

  // 볼륨 컨트롤
  const [isVolumeHover, setIsVolumeHover] = useState(false);

  // 볼륨 토글 - showVolume을 단순히 toggle
  const handleVolumeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowVolume((prev) => !prev);
    setShowPlayback(false);
    setShowSettings(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (videoRef.current) videoRef.current.volume = v / 100;
  };
  const changeVolume = (diff: number) => {
    setVolume((prev) => {
      let next = prev + diff;
      if (next > 100) next = 100;
      if (next < 0) next = 0;
      if (videoRef.current) videoRef.current.volume = next / 100;
      return next;
    });
  };

  // 볼륨팝업 mouse leave 시에만 닫힘
  useEffect(() => {
    if (showVolume && !isVolumeHover) {
      const timeout = setTimeout(() => setShowVolume(false), 350);
      return () => clearTimeout(timeout);
    }
  }, [showVolume, isVolumeHover]);

  // 진행바 클릭 → 시점 이동
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const seek = duration * percent;
    if (videoRef.current) videoRef.current.currentTime = seek;
    setCurrent(seek);
  };

  // 비디오 시간, 재생상태 반영
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [currentIdx, volume, playbackRate]);

  // 비디오 재생/일시정지 토글
  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  // 비디오 이벤트 핸들러
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrent(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handlePlay = () => setPaused(false);
    const handlePause = () => setPaused(true);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("durationchange", updateDuration);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("durationchange", updateDuration);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [currentIdx]);

  // 캡처(이미지 저장) 기능
  const handleCapture = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `capture_${Date.now()}.png`;
        a.click();
        setShowCaptureAlert(true);
        setTimeout(() => setShowCaptureAlert(false), 1300);
      }
    }, "image/png");
  };

  // 배속 조절 슬라이더
  const handlePlaybackSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setPlaybackRate(v);
    if (videoRef.current) videoRef.current.playbackRate = v;
  };

  // 배속/설정 팝업 toggle (같은 아이콘을 클릭했을 때만 토글, 다른 버튼 누르면 닫힘)
  const handlePlaybackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlayback((prev) => !prev);
    setShowSettings(false);
    setShowVolume(false);
  };
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSettings((prev) => !prev);
    setShowPlayback(false);
    setShowVolume(false);
  };

  // 커리큘럼 클릭(목차)
  const handleCurriculumClick = (idx: number) => {
    setCurrentIdx(idx);
    setCurrent(0);
    setPaused(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  // 팝업 바깥 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPlayback(false);
      setShowSettings(false);
      // setShowVolume(false); // 볼륨은 hover로 제어
    };
    if (showPlayback || showSettings) {
      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPlayback, showSettings]);

  const formatTime = (sec: number) => {
    if (!isFinite(sec)) return "00:00";
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(Math.floor(sec % 60)).padStart(2, "0");
    return `${m}:${s}`;
  };

  // 해상도 선택(실제 url 다르게 사용하려면 별도 구현 필요)
  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuality(e.target.value);
    setShowSettings(false);
  };

  // ======================== 렌더 ========================
  return (
    <Wrapper ref={fullscreenRef} onDoubleClick={handleDoubleClick}>
      <VideoSection>
        <TopBar>
          <TopBarBack onClick={handleBack}>
            <BsChevronLeft style={{ fontSize: 23, marginRight: 6 }} />
          </TopBarBack>
          <TopBarTitle>{curriculum[currentIdx].title}</TopBarTitle>
        </TopBar>
        <VideoArea
          style={{ height: "100%", width: "100%" }}
          onMouseMove={handleBarMouseMove}
        >
          <video
            ref={videoRef}
            src={curriculum[currentIdx].videoUrl}
            controls={false}
            style={{
              width: "100%",
              height: "100%",
              background: "#000",
            }}
            onClick={handlePlayToggle}
            onLoadedMetadata={e => {
              setDuration((e.target as HTMLVideoElement).duration);
              setCurrent(0);
              setPaused(true);
            }}
          />
          {isFullscreen ? (
            <ControlsBar visible={showBar}>
              <ProgressBarWrap onClick={handleProgressClick}>
                <ProgressBarFill percent={duration ? Math.floor((current / duration) * 100) : 0} />
              </ProgressBarWrap>
              <VideoControlBar>
                <ControlLeft>
                  <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }} onClick={handlePlayToggle}>
                    {paused ? <FiPlay style={{ fontSize: 22 }} /> : <FiPause style={{ fontSize: 22 }} />}
                  </button>
                  <div style={{ fontSize: 15, minWidth: 82, textAlign: "right" }}>
                    {formatTime(current)} / {formatTime(duration)}
                  </div>
                  {/* 볼륨 컨트롤 */}
                  <VolumeWrapper
                    onClick={handleVolumeClick}
                    onMouseEnter={() => { setIsVolumeHover(true); setShowVolume(true); }}
                    onMouseLeave={() => setIsVolumeHover(false)}
                  >
                    {volume === 0 ? (
                      <FiVolumeX style={{ fontSize: 21 }} />
                    ) : (
                      <FiVolume2 style={{ fontSize: 21 }} />
                    )}
                    {showVolume && (
                      <VolumePopup
                        onClick={e => e.stopPropagation()}
                        onMouseEnter={() => setIsVolumeHover(true)}
                        onMouseLeave={() => setIsVolumeHover(false)}
                      >
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            fontSize: 16,
                            cursor: "pointer",
                            marginRight: 3,
                          }}
                          onClick={e => { e.stopPropagation(); changeVolume(-10); }}
                          tabIndex={-1}
                        >
                          -
                        </button>
                        <VolumeSlider
                          type="range"
                          min={0}
                          max={100}
                          value={volume}
                          onChange={handleVolumeChange}
                          onClick={e => e.stopPropagation()}
                        />
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            fontSize: 16,
                            cursor: "pointer",
                            marginLeft: 3,
                          }}
                          onClick={e => { e.stopPropagation(); changeVolume(10); }}
                          tabIndex={-1}
                        >
                          +
                        </button>
                      </VolumePopup>
                    )}
                  </VolumeWrapper>
                </ControlLeft>
                <ControlRight>
                  <span style={{ position: "relative" }}>
                    <FiCamera title="캡처" style={{ cursor: "pointer" }} onClick={handleCapture} />
                    {showCaptureAlert && (
                      <Popup style={{ right: "0", bottom: "38px", padding: "8px 18px" }}>
                        <span style={{ fontSize: 15 }}>이미지 저장 완료!</span>
                      </Popup>
                    )}
                  </span>
                  <span style={{ position: "relative" }}>
                    <MdSlowMotionVideo
                      title="재생속도"
                      style={{ cursor: "pointer" }}
                      onClick={handlePlaybackClick}
                    />
                    {showPlayback && (
                      <>
                        <Overlay onClick={() => setShowPlayback(false)} />
                        <Popup onClick={e => e.stopPropagation()}>
                          <PopupTitle>재생속도</PopupTitle>
                          <PlaybackSlider
                            type="range"
                            min={0.5}
                            max={2}
                            step={0.5}
                            value={playbackRate}
                            onChange={handlePlaybackSlider}
                          />
                          <PlaybackValue>
                            {playbackRate} <span style={{ fontSize: 13, color: "#fff" }}>X</span>
                          </PlaybackValue>
                        </Popup>
                      </>
                    )}
                  </span>
                  <span style={{ position: "relative" }}>
                    <FiSettings
                      title="설정"
                      style={{ cursor: "pointer" }}
                      onClick={handleSettingsClick}
                    />
                    {showSettings && (
                      <>
                        <Overlay onClick={() => setShowSettings(false)} />
                        <SettingsModal onClick={e => e.stopPropagation()}>
                          <SettingsRow>
                            <div style={{ fontSize: 14, marginBottom: 6 }}>해상도</div>
                            <Select value={quality} onChange={handleQualityChange}>
                              {qualityOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </Select>
                          </SettingsRow>
                        </SettingsModal>
                      </>
                    )}
                  </span>
                  <FiMaximize2 title="전체화면" style={{ cursor: "pointer" }} onClick={handleFullscreen} />
                </ControlRight>
              </VideoControlBar>
              <BottomBar>
                <NaviButton onClick={() => currentIdx > 0 && handleCurriculumClick(currentIdx - 1)}>
                  <BsChevronLeft style={{ marginRight: 5 }} /> 이전
                </NaviButton>
                <NaviButton onClick={() => currentIdx < curriculum.length - 1 && handleCurriculumClick(currentIdx + 1)}>
                  다음 <BsChevronRight style={{ marginLeft: 5 }} />
                </NaviButton>
                <ReviewButton>
                  <BsChatLeftText style={{ marginRight: 6 }} />수강평
                </ReviewButton>
                <Spacer />
                <ItemButton>
                  <FiDownload style={{ marginRight: 3 }} /> 자료 다운로드
                </ItemButton>
                <ItemButton>
                  <FiShare2 style={{ marginRight: 3 }} /> 공유
                </ItemButton>
              </BottomBar>
            </ControlsBar>
          ) : (
            <ControlsBarStatic>
              <ProgressBarWrap onClick={handleProgressClick}>
                <ProgressBarFill percent={duration ? Math.floor((current / duration) * 100) : 0} />
              </ProgressBarWrap>
              <VideoControlBar>
                <ControlLeft>
                  <button style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }} onClick={handlePlayToggle}>
                    {paused ? <FiPlay style={{ fontSize: 22 }} /> : <FiPause style={{ fontSize: 22 }} />}
                  </button>
                  <div style={{ fontSize: 15, minWidth: 82, textAlign: "right" }}>
                    {formatTime(current)} / {formatTime(duration)}
                  </div>
                  {/* 볼륨 컨트롤 */}
                  <VolumeWrapper
                    onClick={handleVolumeClick}
                    onMouseEnter={() => { setIsVolumeHover(true); setShowVolume(true); }}
                    onMouseLeave={() => setIsVolumeHover(false)}
                  >
                    {volume === 0 ? (
                      <FiVolumeX style={{ fontSize: 21 }} />
                    ) : (
                      <FiVolume2 style={{ fontSize: 21 }} />
                    )}
                    {showVolume && (
                      <VolumePopup
                        onClick={e => e.stopPropagation()}
                        onMouseEnter={() => setIsVolumeHover(true)}
                        onMouseLeave={() => setIsVolumeHover(false)}
                      >
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            fontSize: 16,
                            cursor: "pointer",
                            marginRight: 3,
                          }}
                          onClick={e => { e.stopPropagation(); changeVolume(-10); }}
                          tabIndex={-1}
                        >
                          -
                        </button>
                        <VolumeSlider
                          type="range"
                          min={0}
                          max={100}
                          value={volume}
                          onChange={handleVolumeChange}
                          onClick={e => e.stopPropagation()}
                        />
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "#fff",
                            fontSize: 16,
                            cursor: "pointer",
                            marginLeft: 3,
                          }}
                          onClick={e => { e.stopPropagation(); changeVolume(10); }}
                          tabIndex={-1}
                        >
                          +
                        </button>
                      </VolumePopup>
                    )}
                  </VolumeWrapper>
                </ControlLeft>
                <ControlRight>
                  <span style={{ position: "relative" }}>
                    <FiCamera title="캡처" style={{ cursor: "pointer" }} onClick={handleCapture} />
                    {showCaptureAlert && (
                      <Popup style={{ right: "0", bottom: "38px", padding: "8px 18px" }}>
                        <span style={{ fontSize: 15 }}>이미지 저장 완료!</span>
                      </Popup>
                    )}
                  </span>
                  <span style={{ position: "relative" }}>
                    <MdSlowMotionVideo
                      title="재생속도"
                      style={{ cursor: "pointer" }}
                      onClick={handlePlaybackClick}
                    />
                    {showPlayback && (
                      <>
                        <Overlay onClick={() => setShowPlayback(false)} />
                        <Popup onClick={e => e.stopPropagation()}>
                          <PopupTitle>재생속도</PopupTitle>
                          <PlaybackSlider
                            type="range"
                            min={0.5}
                            max={2}
                            step={0.5}
                            value={playbackRate}
                            onChange={handlePlaybackSlider}
                          />
                          <PlaybackValue>
                            {playbackRate} <span style={{ fontSize: 13, color: "#fff" }}>X</span>
                          </PlaybackValue>
                        </Popup>
                      </>
                    )}
                  </span>
                  <span style={{ position: "relative" }}>
                    <FiSettings
                      title="설정"
                      style={{ cursor: "pointer" }}
                      onClick={handleSettingsClick}
                    />
                    {showSettings && (
                      <>
                        <Overlay onClick={() => setShowSettings(false)} />
                        <SettingsModal onClick={e => e.stopPropagation()}>
                          <SettingsRow>
                            <div style={{ fontSize: 14, marginBottom: 6 }}>해상도</div>
                            <Select value={quality} onChange={handleQualityChange}>
                              {qualityOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </Select>
                          </SettingsRow>
                        </SettingsModal>
                      </>
                    )}
                  </span>
                  <FiMaximize2 title="전체화면" style={{ cursor: "pointer" }} onClick={handleFullscreen} />
                </ControlRight>
              </VideoControlBar>
              <BottomBar>
                <NaviButton onClick={() => currentIdx > 0 && handleCurriculumClick(currentIdx - 1)}>
                  <BsChevronLeft style={{ marginRight: 5 }} /> 이전
                </NaviButton>
                <NaviButton onClick={() => currentIdx < curriculum.length - 1 && handleCurriculumClick(currentIdx + 1)}>
                  다음 <BsChevronRight style={{ marginLeft: 5 }} />
                </NaviButton>
                <ReviewButton>
                  <BsChatLeftText style={{ marginRight: 6 }} />수강평
                </ReviewButton>
                <Spacer />
                <ItemButton>
                  <FiDownload style={{ marginRight: 3 }} /> 자료 다운로드
                </ItemButton>
                <ItemButton>
                  <FiShare2 style={{ marginRight: 3 }} /> 공유
                </ItemButton>
              </BottomBar>
            </ControlsBarStatic>
          )}
        </VideoArea>
      </VideoSection>
      {!isFullscreen && (
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
                    <ItemStatus>
                      {item.done ? <FiCheckCircle /> : null}
                    </ItemStatus>
                    <ItemTitle>{item.title}</ItemTitle>
                  </ItemLeft>
                  <ItemButton>
                    자료 <FiDownload />
                  </ItemButton>
                </CurriculumItem>
              ))}
            </CurriculumList>
          </CurriculumSection>
        </RightSidebar>
      )}
    </Wrapper>
  );
};

export default StreamingPage;