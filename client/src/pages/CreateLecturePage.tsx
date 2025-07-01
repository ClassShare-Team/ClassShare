import React, { useRef, useState } from "react";

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

  const hourValid = hour === "" || (/^\d{1,2}$/.test(hour) && Number(hour) >= 1 && Number(hour) <= 24);
  const minValid = minute === "" || (/^\d{1,2}$/.test(minute) && Number(minute) >= 1 && Number(minute) <= 60);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 bg-white justify-between"
      >
        {date && hour && minute
          ? `${date} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`
          : "진행할 실시간 강의 시간을 선택해 주세요"}
        <span className="ml-2">
          <svg width="22" height="22" fill="none" stroke="#bbb" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="3" y="5" width="18" height="16" rx="3" fill="#fff" stroke="#bbb"/>
            <path d="M8 3v4M16 3v4" stroke="#bbb" strokeLinecap="round"/>
            <circle cx="12" cy="14" r="3.2" fill="none" stroke="#bbb"/>
          </svg>
        </span>
      </button>
      {open && (
        <div
          ref={ref}
          className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg border p-5 z-50 flex flex-col gap-3"
        >
          <div>
            <label className="block text-xs text-gray-500 mb-1">날짜</label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-md px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">시간 (1~24)</label>
              <input
                type="number"
                min={1}
                max={24}
                className={`w-full border ${hourValid ? "border-gray-200" : "border-red-400"} rounded-md px-3 py-2`}
                placeholder="시"
                value={hour}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val === "" || (Number(val) >= 1 && Number(val) <= 24)) setHour(val);
                }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">분 (1~60)</label>
              <input
                type="number"
                min={1}
                max={60}
                className={`w-full border ${minValid ? "border-gray-200" : "border-red-400"} rounded-md px-3 py-2`}
                placeholder="분"
                value={minute}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val === "" || (Number(val) >= 1 && Number(val) <= 60)) setMinute(val);
                }}
              />
            </div>
          </div>
          <button
            className={`w-full mt-2 py-2 rounded-lg ${date && hour && minute && hourValid && minValid ? "bg-indigo-500 text-white" : "bg-gray-300 text-gray-100"} font-bold`}
            disabled={!(date && hour && minute && hourValid && minValid)}
            onClick={() => setOpen(false)}
            type="button"
          >
            입력 완료
          </button>
        </div>
      )}
    </div>
  );
}

const CreateLecturePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f4f7fe] via-[#f8faff] to-[#eaf5ff]">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-2 min-w-[180px]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400" />
            <span className="text-lg font-bold text-gray-900">ClassShare</span>
          </div>
          {/* 검색창 (input+icon) + 검색버튼 분리해서 테두리 확실하게 */}
          <div className="flex flex-1 justify-center">
            <div className="flex items-center gap-4 w-[440px]">
              {/* input + icon (테두리, 둥글게) */}
              <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-full px-5 h-12">
                <input
                  type="text"
                  placeholder="나에게 필요한 강의를 찾아보세요"
                  className="flex-1 bg-transparent focus:outline-none text-lg text-gray-700 placeholder-gray-400 font-normal"
                  style={{ minWidth: 0 }}
                />
                {/* 돋보기 아이콘 */}
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.65" y1="16.65" x2="21" y2="21" />
                </svg>
              </div>
              {/* 검색 버튼(분리) */}
              <button className="h-12 w-28 bg-white border border-gray-300 rounded-full text-black font-semibold text-xl hover:bg-gray-50 transition ml-2">
                검색
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2 min-w-[120px] justify-end">
            <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center text-white font-bold">SC</div>
            <span className="font-medium text-gray-700 text-sm">Sarah Chen</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="max-w-6xl mx-auto flex flex-1 w-full py-10 px-6">
          {/* Sidebar */}
          <aside className="w-1/5 min-w-[160px] pr-10">
            <div className="mb-8 text-xl font-bold text-gray-900">강의 제작</div>
            <ol className="space-y-7">
              {[
                "강의 제목",
                "강의 설명",
                "강의 목록",
                "강의 시작 시간",
                "가격",
                "카테고리",
                "강의 썸네일"
              ].map((step, idx) => (
                <li className="flex items-center" key={step}>
                  <div className="flex flex-col items-center mr-4">
                    <div
                      className={
                        idx === 0
                          ? "w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold"
                          : "w-6 h-6 rounded-full border-2 border-gray-300 text-gray-400 flex items-center justify-center font-bold"
                      }
                    >
                      {idx + 1}
                    </div>
                    {idx !== 6 && (
                      <div className="w-px flex-1 bg-gray-200 mt-1"></div>
                    )}
                  </div>
                  <span
                    className={`text-base ${
                      idx === 0
                        ? "text-gray-900 font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </aside>

          {/* Form Card */}
          <section className="flex-1 bg-white rounded-2xl shadow-lg p-10 ml-6">
            <div className="flex justify-end items-center mb-8 gap-2">
              <h2 className="text-2xl font-bold text-center flex-1">내 강의 만들기</h2>
              <button className="px-6 py-2 rounded-full border bg-white font-semibold text-gray-700 shadow hover:bg-gray-100">
                뒤로 가기
              </button>
              <button className="px-6 py-2 rounded-full bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600">
                저장
              </button>
            </div>
            <div className="space-y-8">
              {/* 강의 제목 */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  강의 제목
                </label>
                <input
                  type="text"
                  placeholder="진행할 실시간 강의 제목을 입력해 주세요"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
                />
              </div>
              {/* 강의 설명 */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  강의 설명
                </label>
                <textarea
                  rows={7}
                  placeholder="진행할 실시간 강의 내용을 입력해 주세요"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700 resize-none"
                />
              </div>
              {/* 강의 목록 */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  강의 목록
                </label>
                <input type="file" className="hidden" id="lecture-file"/>
                <label htmlFor="lecture-file" className="cursor-pointer block px-4 py-2 bg-violet-100 text-indigo-600 text-center rounded-lg border border-dashed border-violet-300 hover:bg-violet-200">
                  파일 선택
                </label>
                <div className="text-xs text-gray-500 mt-2">강의 파일을 업로드 해주세요.</div>
              </div>
              {/* 강의 시작 시간 */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  강의 시작 시간
                </label>
                <StartTimePicker />
              </div>
              {/* 가격 & 카테고리 */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-2 font-semibold text-gray-800">
                    가격
                  </label>
                  <input
                    type="text"
                    placeholder="예: 10000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700"
                  />
                  <div className="text-sm text-gray-400 mt-2">희망하는 강의의 가격을 입력해주세요</div>
                </div>
                <div className="flex-1">
                  <label className="block mb-2 font-semibold text-gray-800">
                    카테고리
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-gray-700">
                    <option>교육</option>
                    <option>IT</option>
                    <option>디자인</option>
                    <option>기타</option>
                  </select>
                </div>
              </div>
              {/* 강의 썸네일 */}
              <div>
                <label className="block mb-2 font-semibold text-gray-800">
                  강의 썸네일
                </label>
                <input type="file" className="hidden" id="thumbnail-file"/>
                <label htmlFor="thumbnail-file" className="cursor-pointer flex flex-col items-center justify-center px-4 py-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl">
                  <span className="text-2xl text-gray-400 mb-2">+</span>
                  <span className="text-xs text-gray-500">이미지를 업로드 해주세요.<br/>JPG, PNG 파일만 지원합니다.</span>
                </label>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#eef3fc] border-t border-[#e0e8f8] mt-10 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-400" />
            <span className="text-lg font-bold text-gray-900">ClassShare</span>
          </div>
          <div className="text-sm text-gray-500">
            Developed by 김동민, 김수정, 김진수, 이승우, 이영채, 최현서 | All rights reserved © ClassShare
          </div>
          <a
            href="#"
            className="text-gray-500 hover:text-gray-700 transition"
            aria-label="github"
          >
            <svg
              width="28"
              height="28"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.2"
            >
              <path
                fill="currentColor"
                d="M12 1.75C6.06 1.75 1 6.82 1 12.75c0 4.86 3.44 8.87 8.21 9.87.6.12.82-.26.82-.58 0-.29-.01-1.07-.02-2.09-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.35-1.78-1.35-1.78-1.1-.75.08-.74.08-.74 1.21.09 1.85 1.24 1.85 1.24 1.08 1.86 2.83 1.32 3.52 1.01.11-.78.42-1.33.76-1.64-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.31 1.23a11.5 11.5 0 0 1 3.01-.41c1.02.01 2.05.14 3.01.41 2.3-1.55 3.31-1.23 3.31-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.93.43.37.81 1.09.81 2.2 0 1.59-.01 2.87-.01 3.26 0 .32.22.7.83.58C19.56 21.62 23 17.61 23 12.75c0-5.93-5.06-11-11-11Z"
              />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default CreateLecturePage;
