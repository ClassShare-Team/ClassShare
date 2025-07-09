import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #F4F7FE, #F8FAFF, #EAF5FF);
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  flex: 1;
  width: 100%;
  padding: 2.5rem 1.5rem;
  display: flex;
`;

const Sidebar = styled.aside`
  width: 20%;
  min-width: 160px;
  padding-right: 2.5rem;
`;

const SidebarTitle = styled.div`
  margin-bottom: 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
`;

const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const StepItem = styled.li`
  display: flex;
  align-items: center;
`;

const StepCircle = styled.div<{ active?: boolean }>`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: ${({ active }) => (active ? "#6366f1" : "#fff")};
  color: ${({ active }) => (active ? "#fff" : "#9ca3af")};
  border: ${({ active }) => (active ? "none" : "2px solid #d1d5db")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const StepLine = styled.div`
  width: 1px;
  flex: 1;
  background: #e5e7eb;
  margin-top: 0.25rem;
`;

const StepText = styled.span<{ active?: boolean }>`
  font-size: 1rem;
  color: ${({ active }) => (active ? "#111827" : "#9ca3af")};
  font-weight: ${({ active }) => (active ? "600" : "400")};
`;

const FormCard = styled.section`
  flex: 1;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(49, 72, 187, 0.09);
  padding: 2.5rem;
  margin-left: 1.5rem;
`;

const FormTitleRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 2rem;
  gap: 0.5rem;
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  flex: 1;
`;

const Button = styled.button<{ variant?: "primary" | "default" }>`
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  border: ${({ variant }) => (variant === "default" ? "1px solid #e5e7eb" : "none")};
  background: ${({ variant }) => (variant === "primary" ? "#6366f1" : "#fff")};
  color: ${({ variant }) => (variant === "primary" ? "#fff" : "#374151")};
  box-shadow: 0 2px 4px 0 rgba(49, 72, 187, 0.05);
  cursor: pointer;
  &:hover {
    background: ${({ variant }) => (variant === "primary" ? "#4f46e5" : "#f3f4f6")};
  }
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d2d2d;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #374151;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px #c7d2fe;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #374151;
  font-size: 1rem;
  resize: none;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px #c7d2fe;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  cursor: pointer;
  display: block;
  padding: 0.5rem 1rem;
  background: #ede9fe;
  color: #6366f1;
  text-align: center;
  border-radius: 0.5rem;
  border: 1px dashed #c7d2fe;
  &:hover {
    background: #ddd6fe;
  }
`;

const HelperText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
`;

const Select = styled.select`
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #374151;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px #c7d2fe;
  }
`;

const ThumbnailLabel = styled.label`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 1rem;
`;

const ThumbnailIcon = styled.span`
  font-size: 2rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
`;

const ThumbnailText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
`;

const StartTimePickerWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StartTimeButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  color: #374151;
  background: #fff;
  justify-content: space-between;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #c7d2fe;
    border-color: #6366f1;
  }
`;

const StartTimeDropdown = styled.div`
  position: absolute;
  left: 0;
  margin-top: 0.5rem;
  width: 100%;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 24px 0 rgba(49, 72, 187, 0.09);
  border: 1px solid #e5e7eb;
  padding: 1.25rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const StartTimeInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  border: 1px solid ${({ hasError }) => (hasError ? "#f87171" : "#d1d5db")};
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
`;

const StartTimeDropdownButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.5rem 0;
  border-radius: 0.75rem;
  font-weight: bold;
  background: ${({ disabled }) => (disabled ? "#d1d5db" : "#6366f1")};
  color: ${({ disabled }) => (disabled ? "#f3f4f6" : "#fff")};
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;


// StartTimePicker
function StartTimePicker() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);
  const hourValid =
    hour === "" || (/^\d{1,2}$/.test(hour) && Number(hour) >= 1 && Number(hour) <= 24);
  const minValid =
    minute === "" || (/^\d{1,2}$/.test(minute) && Number(minute) >= 1 && Number(minute) <= 60);
  return (
    <StartTimePickerWrapper>
      <StartTimeButton
        type="button"
        onClick={() => setOpen(!open)}
      >
        {date && hour && minute
          ? `${date} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`
          : "진행할 실시간 강의 시간을 선택해 주세요"}
        <span style={{ marginLeft: 8 }}>
          <svg width="22" height="22" fill="none" stroke="#bbb" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="16" rx="3" fill="#fff" stroke="#bbb" />
            <path d="M8 3v4M16 3v4" stroke="#bbb" strokeLinecap="round" />
            <circle cx="12" cy="14" r="3.2" fill="none" stroke="#bbb" />
          </svg>
        </span>
      </StartTimeButton>
      {open && (
        <StartTimeDropdown ref={ref}>
          <div>
            <Label className="block text-xs text-gray-500 mb-1">날짜</Label>
            <StartTimeInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <Row>
            <div style={{ flex: 1 }}>
              <Label className="block text-xs text-gray-500 mb-1">시간 (1~24)</Label>
              <StartTimeInput
                type="number"
                min={1}
                max={24}
                hasError={!hourValid}
                placeholder="시"
                value={hour}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val === "" || (Number(val) >= 1 && Number(val) <= 24)) setHour(val);
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Label className="block text-xs text-gray-500 mb-1">분 (1~60)</Label>
              <StartTimeInput
                type="number"
                min={1}
                max={60}
                hasError={!minValid}
                placeholder="분"
                value={minute}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val === "" || (Number(val) >= 1 && Number(val) <= 60)) setMinute(val);
                }}
              />
            </div>
          </Row>
          <StartTimeDropdownButton
            disabled={!(date && hour && minute && hourValid && minValid)}
            onClick={() => setOpen(false)}
            type="button"
          >
            입력 완료
          </StartTimeDropdownButton>
        </StartTimeDropdown>
      )}
    </StartTimePickerWrapper>
  );
}


// CreateLecturePage
const CreateLecturePage: React.FC = () => {
  return (
    <PageWrapper>
      <MainContent>
        <Container>
          <Sidebar>
            <SidebarTitle>강의 제작</SidebarTitle>
            <StepList>
              {[
                "강의 제목",
                "강의 설명",
                "강의 목록",
                "강의 시작 시간",
                "가격",
                "카테고리",
                "강의 썸네일"
              ].map((step, idx) => (
                <StepItem key={step}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "1rem" }}>
                    <StepCircle active={idx === 0}>{idx + 1}</StepCircle>
                    {idx !== 6 && <StepLine />}
                  </div>
                  <StepText active={idx === 0}>{step}</StepText>
                </StepItem>
              ))}
            </StepList>
          </Sidebar>
          <FormCard>
            <FormTitleRow>
              <FormTitle>내 강의 만들기</FormTitle>
              <Button variant="default">뒤로 가기</Button>
              <Button variant="primary">저장</Button>
            </FormTitleRow>
            <div>
              {/* 강의 제목 */}
              <FormSection>
                <Label>강의 제목</Label>
                <Input
                  type="text"
                  placeholder="진행할 실시간 강의 제목을 입력해 주세요"
                />
              </FormSection>
              {/* 강의 설명 */}
              <FormSection>
                <Label>강의 설명</Label>
                <TextArea
                  rows={7}
                  placeholder="진행할 실시간 강의 내용을 입력해 주세요"
                />
              </FormSection>
              {/* 강의 목록 */}
              <FormSection>
                <Label>강의 목록</Label>
                <FileInput type="file" id="lecture-file"/>
                <FileLabel htmlFor="lecture-file">파일 선택</FileLabel>
                <HelperText>강의 파일을 업로드 해주세요.</HelperText>
              </FormSection>
              {/* 강의 시작 시간 */}
              <FormSection>
                <Label>강의 시작 시간</Label>
                <StartTimePicker />
              </FormSection>
              {/* 가격 & 카테고리 */}
              <FormSection>
                <Row>
                  <div style={{ flex: 1 }}>
                    <Label>가격</Label>
                    <Input
                      type="text"
                      placeholder="예: 10000"
                    />
                    <HelperText>희망하는 강의의 가격을 입력해주세요</HelperText>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label>카테고리</Label>
                    <Select>
                      <option>교육</option>
                      <option>개발</option>
                      <option>음악</option>
                      <option>요리</option>
                      <option>운동</option>
                      <option>예술</option>
                      <option>글쓰기</option>
                    </Select>
                  </div>
                </Row>
              </FormSection>
              {/* 강의 썸네일 */}
              <FormSection>
                <Label>강의 썸네일</Label>
                <FileInput type="file" id="thumbnail-file"/>
                <ThumbnailLabel htmlFor="thumbnail-file">
                  <ThumbnailIcon>+</ThumbnailIcon>
                  <ThumbnailText>
                    이미지를 업로드 해주세요.<br />JPG, PNG 파일만 지원합니다.
                  </ThumbnailText>
                </ThumbnailLabel>
              </FormSection>
            </div>
          </FormCard>
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

export default CreateLecturePage;
