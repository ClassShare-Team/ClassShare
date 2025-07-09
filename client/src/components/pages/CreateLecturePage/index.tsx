import React, { useEffect, useState } from "react";
import "./index.css";

interface Lecture {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  review: string;
}

const CreateLecturePage: React.FC = () => {
  const [lecture, setLecture] = useState<Lecture | null>(null);

  useEffect(() => {
    // 실제 API로 교체 예정, 현재는 임시 더미 데이터
    const dummyLecture = {
      id: 1,
      title: "React 입문 강의",
      description: "React와 함께하는 첫 번째 프론트엔드 여정",
      price: "무료",
      thumbnail: "../public/test.png",
      review: "★★★★★ 최고의 강의였어요!",
    };

    setLecture(dummyLecture);
  }, []);

  if (!lecture) return <div>로딩 중...</div>;

  return (
    <div className="lecture-wrapper">
      <div className="header-bg">
        <div className="title-thumbnail-area">
          <div className="title-area">
            <h1>{lecture.title}</h1>
          </div>
          <div className="thumbnail-area">
            <img className="thumbnail" src={lecture.thumbnail} alt="썸네일" />
          </div>
        </div>
      </div>
      <div className="content-area">
        <div className="left-content">
          <div className="description-box">
            <p className="description">{lecture.description}</p>
          </div>
          <div className="review-box">
            <strong>리뷰</strong>
            <p>{lecture.review}</p>
          </div>
        </div>
        <div className="right-content">
          <div className="price-box">
            <p className="price">{lecture.price}</p>
            <button className="enroll-btn">수강하기</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLecturePage;
