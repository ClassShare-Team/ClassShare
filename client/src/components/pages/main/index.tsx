import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.css";

interface Lecture {
  id: number;
  title: string;
  price: number | string;
  category: string;
  thumbnail: string;
}

const categories = ["교육", "개발", "음악", "요리", "운동", "글쓰기", "예술"];

const MainPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [filteredLectures, setFilteredLectures] = useState<Lecture[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/lectures`);
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

  const renderPrice = (price: number | string) => {
    const num = Number(price);
    return isNaN(num) ? String(price) : num.toLocaleString();
  };

  const scroll = (category: string, dir: "left" | "right") => {
    const container = scrollRefs.current[category];
    if (container) {
      const scrollAmount = 260;
      container.scrollLeft += dir === "left" ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className="main-wrapper">
      <div className="scroll-container">
        {selectedCategory === "전체"
          ? categories.map((category) => (
              <section key={category} className="section">
                <h2 className="category-title">{category}</h2>
                {groupedLectures[category]?.length ? (
                  <div className="carousel-wrapper">
                    <button className="scroll-btn left" onClick={() => scroll(category, "left")}>
                      ←
                    </button>
                    <div
                      className="card-carousel"
                      ref={(el) => {
                        scrollRefs.current[category] = el;
                      }}
                    >
                      {groupedLectures[category].map((lecture) => (
                        <div
                          className="card"
                          key={lecture.id}
                          onClick={() => navigate(`/lectures/${lecture.id}/apply`)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="thumbnail-wrapper">
                            <img
                              className="thumbnail"
                              src={lecture.thumbnail}
                              alt={lecture.title}
                            />
                          </div>
                          <div className="card-content">
                            <div className="title">{lecture.title}</div>
                            <div className="price">{renderPrice(lecture.price)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="scroll-btn right" onClick={() => scroll(category, "right")}>
                      →
                    </button>
                  </div>
                ) : (
                  <div className="empty-card">아직 등록된 클래스가 없습니다.</div>
                )}
              </section>
            ))
          : (
            <section className="section">
              <h2 className="category-title">{selectedCategory}</h2>
              <div className="card-grid">
                {filteredLectures.length ? (
                  filteredLectures.map((lecture) => (
                    <div
                      className="card"
                      key={lecture.id}
                      onClick={() => navigate(`/lectures/${lecture.id}/apply`)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="thumbnail-wrapper">
                        <img
                          className="thumbnail"
                          src={lecture.thumbnail}
                          alt={lecture.title}
                        />
                      </div>
                      <div className="card-content">
                        <div className="title">{lecture.title}</div>
                        <div className="price">{renderPrice(lecture.price)}</div>
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
