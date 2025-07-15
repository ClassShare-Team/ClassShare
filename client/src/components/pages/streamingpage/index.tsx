import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiCheckCircle,
  FiDownload,
  FiVolume2,
  FiVolumeX,
  FiPlay,
  FiSettings,
  FiMaximize2,
  FiCamera,
  FiShare2,
} from 'react-icons/fi';
import { MdSlowMotionVideo } from 'react-icons/md';
import { BsChevronLeft, BsChevronRight, BsChatLeftText } from 'react-icons/bs';

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
  color: ${({ theme }) => theme.colors.white};
  font-size: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 18px;
`;

const TopBarTitle = styled.div`
  color: ${({ theme }) => theme.colors.white};
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
  background: ${({ theme }) => theme.colors.black};
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const VideoArea = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.black};
  position: relative;
`;

const ControlsBar = styled.div<{ visible: boolean }>`
  width: 100%;
  background: #161616;
  position: absolute;
  left: 0;
  bottom: 0;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
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
`;

const VolumePopup = styled.div`
  position: absolute;
  bottom: 35px;
  left: -10px;
  background: transparent;
  display: flex;
  align-items: center;
  z-index: 2;
  padding: 0;
`;

const VolumeSlider = styled.input`
  width: 90px;
  height: 4px;
  accent-color: ${({ theme }) => theme.colors.white};
  margin-left: 8px;
  background: ${({ theme }) => theme.colors.white};
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
  color: ${({ theme }) => theme.colors.white};
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
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.gray100};
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

const SectionTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #767676;
  margin-bottom: 16px;
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
  background: ${({ active }) => (active ? '#e9faf1' : '#fff')};
  border-radius: 10px;
  margin-bottom: 3px;
  font-weight: ${({ active }) => (active ? 700 : 400)};
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

export const StreamingPage = () => {
  const [showVolume, setShowVolume] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBar, setShowBar] = useState(true);

  const [current, setCurrent] = useState(1806); // 30:06
  const duration = 3459; // 57:39

  const fullscreenRef = useRef<HTMLDivElement>(null);
  // any 대신 정확한 타입 명시
  const barTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      setShowBar(document.fullscreenElement ? false : true);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFullscreen && e.key === 'Escape') {
        document.exitFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // 더블클릭(왼쪽버튼)시 전체화면 해제
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isFullscreen && e.button === 0) {
      document.exitFullscreen();
    }
  };

  // 전체화면일 때만 showBar true/false
  const handleBarMouseMove = () => {
    if (!isFullscreen) return;
    setShowBar(true);
    if (barTimeout.current) clearTimeout(barTimeout.current);
    barTimeout.current = setTimeout(() => setShowBar(false), 5000);
  };

  // 전체화면 벗어나면 showBar 항상 true
  useEffect(() => {
    if (!isFullscreen) setShowBar(true);
  }, [isFullscreen]);

  // 볼륨 컨트롤
  const handleVolumeClick = () => setShowVolume((prev) => !prev);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setVolume(Number(e.target.value));
  const changeVolume = (diff: number) => {
    setVolume((prev) => {
      let next = prev + diff;
      if (next > 100) next = 100;
      if (next < 0) next = 0;
      return next;
    });
  };

  // 진행바 클릭 → 시점 이동
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    setCurrent(Math.floor(duration * percent));
  };

  const formatTime = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // 뒤로가기 (예시: window.history.back())
  const handleBack = () => {
    window.history.back();
  };

  return (
    <Wrapper ref={fullscreenRef} onDoubleClick={handleDoubleClick}>
      <VideoSection>
        {/* 상단바 추가 */}
        <TopBar>
          <TopBarBack onClick={handleBack}>
            <BsChevronLeft style={{ fontSize: 23, marginRight: 6 }} />
          </TopBarBack>
          <TopBarTitle>반복문 (v2)</TopBarTitle>
        </TopBar>
        <VideoArea style={{ height: '100%', width: '100%' }} onMouseMove={handleBarMouseMove}>
          {/* (여기에 video 태그 넣어도 됨) */}

          {/* 전체화면일 때만 툴바 마우스오버로 show/hide, 평소엔 고정 */}
          {isFullscreen ? (
            <ControlsBar visible={showBar}>
              <ProgressBarWrap onClick={handleProgressClick}>
                <ProgressBarFill percent={Math.floor((current / duration) * 100)} />
              </ProgressBarWrap>
              <VideoControlBar>
                <ControlLeft>
                  <FiPlay style={{ fontSize: 22, cursor: 'pointer' }} />
                  <div style={{ fontSize: 15, minWidth: 82, textAlign: 'right' }}>
                    {formatTime(current)} / {formatTime(duration)}
                  </div>
                  <VolumeWrapper style={{ marginLeft: 12, cursor: 'pointer' }}>
                    <span onClick={handleVolumeClick}>
                      {volume === 0 ? (
                        <FiVolumeX style={{ fontSize: 21 }} />
                      ) : (
                        <FiVolume2 style={{ fontSize: 21 }} />
                      )}
                    </span>
                    {showVolume && (
                      <VolumePopup onClick={(e) => e.stopPropagation()}>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: 16,
                            cursor: 'pointer',
                            marginRight: 3,
                          }}
                          onClick={() => changeVolume(-10)}
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
                        />
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: 16,
                            cursor: 'pointer',
                            marginLeft: 3,
                          }}
                          onClick={() => changeVolume(10)}
                          tabIndex={-1}
                        >
                          +
                        </button>
                      </VolumePopup>
                    )}
                  </VolumeWrapper>
                </ControlLeft>
                <ControlRight>
                  <FiCamera title="캡처" />
                  <MdSlowMotionVideo title="재생속도" />
                  <FiSettings title="설정" />
                  <FiMaximize2
                    title="전체화면"
                    style={{ cursor: 'pointer' }}
                    onClick={handleFullscreen}
                  />
                </ControlRight>
              </VideoControlBar>
              <BottomBar>
                <NaviButton>
                  <BsChevronLeft style={{ marginRight: 5 }} /> 이전
                </NaviButton>
                <NaviButton>
                  다음 <BsChevronRight style={{ marginLeft: 5 }} />
                </NaviButton>
                <ReviewButton>
                  <BsChatLeftText style={{ marginRight: 6 }} />
                  수강평
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
                <ProgressBarFill percent={Math.floor((current / duration) * 100)} />
              </ProgressBarWrap>
              <VideoControlBar>
                <ControlLeft>
                  <FiPlay style={{ fontSize: 22, cursor: 'pointer' }} />
                  <div style={{ fontSize: 15, minWidth: 82, textAlign: 'right' }}>
                    {formatTime(current)} / {formatTime(duration)}
                  </div>
                  <VolumeWrapper style={{ marginLeft: 12, cursor: 'pointer' }}>
                    <span onClick={handleVolumeClick}>
                      {volume === 0 ? (
                        <FiVolumeX style={{ fontSize: 21 }} />
                      ) : (
                        <FiVolume2 style={{ fontSize: 21 }} />
                      )}
                    </span>
                    {showVolume && (
                      <VolumePopup onClick={(e) => e.stopPropagation()}>
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: 16,
                            cursor: 'pointer',
                            marginRight: 3,
                          }}
                          onClick={() => changeVolume(-10)}
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
                        />
                        <button
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: 16,
                            cursor: 'pointer',
                            marginLeft: 3,
                          }}
                          onClick={() => changeVolume(10)}
                          tabIndex={-1}
                        >
                          +
                        </button>
                      </VolumePopup>
                    )}
                  </VolumeWrapper>
                </ControlLeft>
                <ControlRight>
                  <FiCamera title="캡처" />
                  <MdSlowMotionVideo title="재생속도" />
                  <FiSettings title="설정" />
                  <FiMaximize2
                    title="전체화면"
                    style={{ cursor: 'pointer' }}
                    onClick={handleFullscreen}
                  />
                </ControlRight>
              </VideoControlBar>
              <BottomBar>
                <NaviButton>
                  <BsChevronLeft style={{ marginRight: 5 }} /> 이전
                </NaviButton>
                <NaviButton>
                  다음 <BsChevronRight style={{ marginLeft: 5 }} />
                </NaviButton>
                <ReviewButton>
                  <BsChatLeftText style={{ marginRight: 6 }} />
                  수강평
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
      {/* 전체화면 아닐 때만 사이드바 보여줌 */}
      {!isFullscreen && (
        <RightSidebar>
          <SidebarTitle>커리큘럼</SidebarTitle>
          <CurriculumSection>
            <SectionTitle>섹션 2. 쾌속 언어 공통 문법 빠르게 풀어보기</SectionTitle>
            <CurriculumList>
              <CurriculumItem done>
                <ItemLeft>
                  <ItemStatus>
                    <FiCheckCircle />
                  </ItemStatus>
                  <ItemTitle>4. 주석과 시작점</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem done>
                <ItemLeft>
                  <ItemStatus>
                    <FiCheckCircle />
                  </ItemStatus>
                  <ItemTitle>5. 입력과 출력</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem done>
                <ItemLeft>
                  <ItemStatus>
                    <FiCheckCircle />
                  </ItemStatus>
                  <ItemTitle>6. 변수 선언과 출력</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem done>
                <ItemLeft>
                  <ItemStatus>
                    <FiCheckCircle />
                  </ItemStatus>
                  <ItemTitle>7. 조건문 (v2)</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem active>
                <ItemLeft>
                  <ItemStatus>
                    <FiCheckCircle />
                  </ItemStatus>
                  <ItemTitle>8. 반복문 (v2)</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem>
                <ItemLeft>
                  <ItemStatus />
                  <ItemTitle>9. 비교연산자와 반복문·조건문 문제 풀이 (v2)</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem>
                <ItemLeft>
                  <ItemStatus />
                  <ItemTitle>10. 함수(메서드) 선언과 호출</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem>
                <ItemLeft>
                  <ItemStatus />
                  <ItemTitle>11. 연산자와 기출문제</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
              <CurriculumItem>
                <ItemLeft>
                  <ItemStatus />
                  <ItemTitle>12. switch-case문</ItemTitle>
                </ItemLeft>
                <ItemButton>
                  자료 <FiDownload />
                </ItemButton>
              </CurriculumItem>
            </CurriculumList>
          </CurriculumSection>
        </RightSidebar>
      )}
    </Wrapper>
  );
};

export default StreamingPage;
