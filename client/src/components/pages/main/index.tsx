import React, { useEffect, useState } from "react";
import "./index.css";

interface Lecture {
  id: number;
  title: string;
  category: string;
  price: string;
  image?: string;
  tag?: string;
}

const categories = ["전체", "교육", "개발", "음악", "요리", "운동", "글쓰기", "예술", "마케팅"];

const MainPage: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  useEffect(() => {
    fetch("http://localhost:5000/lectures")
      .then((res) => res.json())
      .then((data) => {
        setLectures(data);
      })
      .catch((err) => {
        console.error("강의 데이터를 불러오는데 실패했습니다:", err);
      });
  }, []);

  useEffect(() => {
    const storedKeyword = localStorage.getItem("searchKeyword") || "";
    setSearchKeyword(storedKeyword);

    const storedCategory = localStorage.getItem("selectedCategory") || "전체";
    setSelectedCategory(storedCategory);

    const handleStorageChange = () => {
      const updatedKeyword = localStorage.getItem("searchKeyword") || "";
      const updatedCategory = localStorage.getItem("selectedCategory") || "전체";
      setSearchKeyword(updatedKeyword);
      setSelectedCategory(updatedCategory);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const filteredLectures = lectures.filter((lec) => {
    const matchesSearch = lec.title.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || lec.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedCategories = selectedCategory === "전체"
    ? categories.filter((cat) => cat !== "전체")
    : [selectedCategory];

  return (
    <div className="main-wrapper">
      <div className="scroll-container">
        {displayedCategories.map((category) => (
          <section className="section" key={category}>
            <h2>{category}</h2>
            <div className="card-grid">
              {filteredLectures.filter((lec) => lec.category === category).length === 0 ? (
                <div className="card empty">아직 등록된 클래스가 없습니다.</div>
              ) : (
                filteredLectures
                  .filter((lec) => lec.category === category)
                  .map((lec) => (
                    <div key={lec.id} className="card">
                      <p className="title">{lec.title}</p>
                      <span className="tag">{lec.tag || "태그 없음"}</span>
                      <strong className="price">{lec.price || "가격 미정"}</strong>
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
