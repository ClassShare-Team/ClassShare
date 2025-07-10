import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

// ----------------- styled-components -----------------
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
const RemoveButton = styled.button`
  margin-left: 0.75rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  border: none;
  background: #f87171;
  color: #fff;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: #ef4444;
  }
`;
// -----------------------------------------------------

const CreateLecturePage: React.FC = () => {
  const [videos, setVideos] = useState([{ title: "", file: null as File | null }]);
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("교육");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleAddVideo = () => setVideos([...videos, { title: "", file: null }]);
  const handleVideoChange = (idx: number, field: "title" | "file", value: any) => {
    setVideos(videos.map((v, i) =>
      i === idx ? { ...v, [field]: value } : v
    ));
  };
  const handleRemoveVideo = (idx: number) => {
    if (videos.length === 1) return;
    setVideos(videos.filter((_, i) => i !== idx));
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async () => {
  if (!title || !description || !price || !category || !thumbnail || videos.some(v => !v.title || !v.file)) {
    alert("모든 항목을 입력/선택해 주세요.");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("thumbnail", thumbnail);

    // 🔥🔥 여기서 수정: lecturesArr 및 lectures append → "titles" 배열로 각각 title 추가, videos도 각각 append
    videos.forEach((video) => {
      if (video.file) formData.append("videos", video.file);
      formData.append("titles", video.title);
    });

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    await axios.post(
      "/lectures",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    alert("강의가 등록되었습니다!");
  } catch (error: any) {
    alert("등록 실패: " + (error?.response?.data?.message || error.message));
  }
};


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
                "강의 영상",
                "가격",
                "카테고리",
                "강의 썸네일"
              ].map((step, idx) => (
                <StepItem key={step}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: "1rem" }}>
                    <StepCircle active={idx === 0}>{idx + 1}</StepCircle>
                    {idx !== 5 && <StepLine />}
                  </div>
                  <StepText active={idx === 0}>{step}</StepText>
                </StepItem>
              ))}
            </StepList>
          </Sidebar>
          <FormCard>
            <FormTitleRow>
              <FormTitle>내 강의 만들기</FormTitle>
              <Button variant="default" type="button">뒤로 가기</Button>
              <Button variant="primary" type="button" onClick={handleSubmit}>
                저장
              </Button>
            </FormTitleRow>
            <div>
              <FormSection>
                <Label>강의 제목</Label>
                <Input
                  type="text"
                  placeholder="강의 제목을 입력해 주세요"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </FormSection>
              <FormSection>
                <Label>강의 설명</Label>
                <TextArea
                  rows={7}
                  placeholder="강의 내용을 입력해 주세요"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </FormSection>
              <FormSection>
                <Label>강의 영상</Label>
                {videos.map((video, idx) => (
                  <div key={idx} style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        type="text"
                        placeholder={`영상 제목을 입력하세요 (${idx + 1})`}
                        value={video.title}
                        onChange={e => handleVideoChange(idx, "title", e.target.value)}
                        style={{ marginBottom: "0.5rem" }}
                      />
                      <FileInput
                        type="file"
                        accept="video/*"
                        id={`video-file-${idx}`}
                        onChange={e => handleVideoChange(idx, "file", e.target.files?.[0] || null)}
                      />
                      <FileLabel htmlFor={`video-file-${idx}`}>영상 파일 선택</FileLabel>
                      {video.file && <HelperText>선택됨: {video.file.name}</HelperText>}
                    </div>
                    <RemoveButton
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      disabled={videos.length === 1}
                      style={{
                        opacity: videos.length === 1 ? 0.4 : 1,
                        pointerEvents: videos.length === 1 ? "none" : "auto"
                      }}
                    >
                      삭제
                    </RemoveButton>
                  </div>
                ))}
                <Button type="button" variant="default" onClick={handleAddVideo} style={{ marginTop: "0.5rem" }}>
                  + 강의 영상 추가
                </Button>
              </FormSection>
              <FormSection>
                <Row>
                  <div style={{ flex: 1 }}>
                    <Label>가격</Label>
                    <Input
                      type="text"
                      placeholder="예: 10000"
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                    />
                    <HelperText>희망하는 강의의 가격을 입력해주세요</HelperText>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Label>카테고리</Label>
                    <Select value={category} onChange={e => setCategory(e.target.value)}>
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
              <FormSection>
                <Label>강의 썸네일</Label>
                <FileInput type="file" id="thumbnail-file" accept="image/png, image/jpeg" onChange={handleThumbnailChange} />
                <ThumbnailLabel htmlFor="thumbnail-file">
                  <ThumbnailIcon>+</ThumbnailIcon>
                  <ThumbnailText>
                    이미지를 업로드 해주세요.<br />JPG, PNG 파일만 지원합니다.
                  </ThumbnailText>
                </ThumbnailLabel>
                {thumbnail && <HelperText>선택됨: {thumbnail.name}</HelperText>}
              </FormSection>
            </div>
          </FormCard>
        </Container>
      </MainContent>
    </PageWrapper>
  );
};

export default CreateLecturePage;
