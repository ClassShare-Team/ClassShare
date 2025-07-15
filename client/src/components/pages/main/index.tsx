import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./index.css";

interface Lecture {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnailUrl: string;
}

const categories = ["교육", "개발", "음악", "요리", "운동", "글쓰기", "예술", "연희활동"];

const MainPage: React.FC = () => {
  const location = useLocation();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const storedKeyword = localStorage.getItem("searchKeyword") || "";
    const storedCategory =
      location.state?.selectedCategory || localStorage.getItem("selectedCategory") || "전체";

    setSearchKeyword(storedKeyword);
    setSelectedCategory(storedCategory);
  }, [location.state]);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/lectures");
        setLectures(response.data);
      } catch (error) {
        console.error("강의 데이터를 불러오는데 실패했습니다.", error);
      }
    };
    fetchLectures();
  }, []);

  useEffect(() => {
    let result = [...lectures];

    if (selectedCategory !== "전체") {
      result = result.filter((lecture) => lecture.category === selectedCategory);
    }

    if (searchKeyword) {
      result = result.filter((lecture) => lecture.title.includes(searchKeyword));
    }

    setFilteredLectures(result);
  }, [lectures, selectedCategory, searchKeyword]);

  const groupedLectures = categories.reduce((acc, category) => {
    acc[category] = filteredLectures.filter((lecture) => lecture.category === category);
    return acc;
  }, {} as Record<string, Lecture[]>);

  return (
    <div className="main-wrapper">
      <div className="scroll-container">
        {selectedCategory === "전체"
          ? categories.map((category) => (
              <section key={category} className="section">
                <h2>{category}</h2>
                <div className="card-grid">
                  {groupedLectures[category]?.length ? (
                    groupedLectures[category].map((lecture) => (
                      <div className="card" key={lecture.id}>
                        <div className="thumbnail-wrapper">
                          <img className="thumbnail" src={lecture.thumbnailUrl} alt={lecture.title} />
                        </div>
                        <div className="card-content">
                          <div className="title">{lecture.title}</div>
                          <div className="price">{lecture.price.toFixed(2)}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-card">아직 등록된 클래스가 없습니다.</div>
                  )}
                </div>
              </section>
            ))
          : (
            <section className="section">
              <h2>{selectedCategory}</h2>
              <div className="card-grid">
                {filteredLectures.length ? (
                  filteredLectures.map((lecture) => (
                    <div className="card" key={lecture.id}>
                      <div className="thumbnail-wrapper">
                        <img className="thumbnail" src={lecture.thumbnailUrl} alt={lecture.title} />
                      </div>
                      <div className="card-content">
                        <div className="title">{lecture.title}</div>
                        <div className="price">{lecture.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-card">아직 등록된 클래스가 없습니다.</div>
                )}
              </div>
            </section>
          )}
      </div>
    </div>
  );
};

export default MainPage;
