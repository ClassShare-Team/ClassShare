import React, { useEffect, useState } from "react";
import { Header } from "../../layout/Header";
import { Footer } from "../../layout/Footer";
import "./index.css";

interface Lecture {
  id: number;
  title: string;
  category: string;
  price: string;
  image: string;
  tag: string;
}

const dummyLectures: Lecture[] = [
  { id: 1, title: "JavaScript 입문", category: "개발", price: "무료", image: "", tag: "프로그래밍" },
  { id: 2, title: "수채화 기초", category: "예술", price: "25,000원", image: "", tag: "그림" },
  { id: 3, title: "헬스 기초", category: "운동", price: "15,000원", image: "", tag: "건강" },
  { id: 4, title: "글쓰기 마스터", category: "글쓰기", price: "30,000원", image: "", tag: "에세이" },
  { id: 5, title: "기타 초급", category: "음악", price: "무료", image: "", tag: "음악" },
  { id: 6, title: "초등 수학 기초", category: "교육", price: "무료", image: "", tag: "수학" },
  { id: 7, title: "과학실험 따라하기", category: "교육", price: "15,000원", image: "", tag: "과학" },
  { id: 8, title: "영어 회화 스타터", category: "교육", price: "29,000원", image: "", tag: "영어" },
];

const MainPage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    setLectures(dummyLectures);
  }, []);

  const categories = ["교육", "개발", "음악", "요리", "운동", "글쓰기", "예술", "마케팅"];

  return (
    <div className="main-wrapper">
      
{/*
      <nav className="top-nav">
        <button>메인</button>
        <button>수강 중인 강의</button>
        <button>게시판</button>
      </nav>

      <div className="category-filter">
        {["전체", ...categories].map((cat) => (
          <button key={cat}>{cat}</button>
        ))}
      </div>
*/}
      <div className="scroll-container">
        {categories.map((category) => (
          <section className="section" key={category}>
            <h2>{category}</h2>
            <div className="card-grid">
              {lectures.filter((l) => l.category === category).length === 0 ? (
                <div className="card empty">아직 등록된 클래스가 없습니다.</div>
              ) : (
                lectures
                  .filter((l) => l.category === category)
                  .map((lec) => (
                    <div key={lec.id} className="card">
                      <p className="title">{lec.title}</p>
                      <span className="tag">{lec.tag}</span>
                      <strong className="price">{lec.price}</strong>
                    </div>
                  ))
              )}
            </div>
          </section>
        ))}
      </div>

      
    </div>
  );
};

export default MainPage;
