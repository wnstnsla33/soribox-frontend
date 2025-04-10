import React, { useState } from "react";
import usePostData from "./usePostData";
import PostListComponent from "./PostListComponent";

export default function Post() {
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortType, setSortType] = useState(1);
  const [keyword, setKeyword] = useState("");

  const {
    posts,
    toggleBookmark,
    page,
    totalPages,
    nextPage,
    prevPage,
    setPage,
  } = usePostData(showBookmarksOnly, sortType, keyword);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    setPage(1); // 키워드 변경 시 페이지 초기화
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* 상단 필터바 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        {/* 북마크 토글 */}
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showBookmarksOnly}
              onChange={() => setShowBookmarksOnly((prev) => !prev)}
            />
            <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 transition-all"></div>
            <span
              className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                showBookmarksOnly ? "translate-x-6" : ""
              }`}
            ></span>
          </label>
          <span className="text-gray-700 font-medium">
            {showBookmarksOnly ? "북마크만 보기" : "전체 글 보기"}
          </span>
        </div>

        {/* 검색 입력 */}
        <input
          type="text"
          placeholder="검색어 입력"
          value={keyword}
          onChange={handleKeywordChange}
          className="border rounded px-3 py-2 w-full sm:w-64"
        />

        {/* 정렬 필터 */}
        <div className="flex space-x-3">
          <button
            onClick={() => setSortType(1)}
            className={`px-4 py-2 rounded border ${
              sortType === 1
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            날짜순
          </button>
          <button
            onClick={() => setSortType(2)}
            className={`px-4 py-2 rounded border ${
              sortType === 2
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            조회수 순
          </button>
          <button
            onClick={() => setSortType(3)}
            className={`px-4 py-2 rounded border ${
              sortType === 3
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            북마크 순
          </button>
        </div>
      </div>

      {/* 게시글 리스트 */}
      <PostListComponent posts={posts} ClickBookmark={toggleBookmark} />

      {/* 페이지네이션 */}
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          이전
        </button>
        <span className="font-medium">
          {page} / {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          다음
        </button>
      </div>
    </div>
  );
}
