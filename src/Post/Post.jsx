import React, { useState } from "react";
import usePostData from "./usePostData";
import PostListComponent from "./PostListComponent";

export default function Post() {
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [sortType, setSortType] = useState(1); // 기본 추천순

  const {
    posts,
    userBookmarks,
    toggleBookmark,
    page,
    totalPages,
    nextPage,
    prevPage,
  } = usePostData(showBookmarksOnly, sortType); // sortType도 넘길 수 있도록 설계하면 좋아요

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* 북마크 토글 */}
      <div className="flex items-center justify-between mb-6">
        {/* 토글 스위치 */}
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

        {/* 정렬 필터 */}
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
      <PostListComponent
        posts={posts}
        userBookmarks={userBookmarks}
        ClickBookmark={toggleBookmark}
      />

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
