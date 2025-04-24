import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bookmark from "../img/bookmark.png";
import noBookmark from "../img/noBookmark.png";
import axios from "axios";

export default function PostListComponent({ posts, ClickBookmark }) {
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;
  const getFirstImageFromContent = (html) => {
    if (!html) return `${BASE_URL}/uploads/classicImage/noimg.png`;
    const match = html.match(/<img[^>]+src=["']?([^>"']+)["']?[^>]*>/);
    return match?.[1] || `${BASE_URL}/uploads/classicImage/noimg.png`;
  };

  const getTextOnlyFromContent = (html) => {
    if (!html) return "";
    return html
      .replace(/<img[^>]*>/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleSecretPostClick = (postId) => {
    setSelectedPostId(postId);
    setShowPopup(true);
  };

  const handleConfirmPassword = async (postId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/post/secrete/${postId}`,
        { pwd: password },
        { withCredentials: true }
      );
      setShowPopup(false);
      setPassword("");
      navigate(`/post/${postId}`, { state: { post: res.data.data } });
    } catch (err) {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setPassword("");
  };

  const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {posts.map((post) =>
          post.title === "비밀글" ? (
            <div
              key={post.postId}
              onClick={() => handleSecretPostClick(post.postId)}
              className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden relative hover:shadow-2xl transition"
            >
              <div className="relative h-60 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-xl">
                  🔒 비밀글
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 truncate">
                  비밀글입니다
                </h3>
                <p className="text-sm text-gray-700 line-clamp-2">
                  비밀번호를 입력하면 내용을 볼 수 있습니다.
                </p>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span className="truncate max-w-[50%]">
                    {post.userNickName}
                  </span>
                  <span>조회수 {post.viewCount}</span>
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={post.postId}
              to={`/post/${post.postId}`}
              state={{ post }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative hover:shadow-2xl transition">
                <div className="relative h-60">
                  <img
                    src={getFirstImageFromContent(post.content)}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <img
                      src={post.bookmarked ? bookmark : noBookmark}
                      alt="북마크"
                      onClick={(e) => {
                        e.preventDefault();
                        ClickBookmark(post.postId);
                      }}
                      className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                    />
                    <span className="text-sm text-white bg-black bg-opacity-50 rounded px-2 py-0.5">
                      {post.bookmarkCount}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 truncate">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {getTextOnlyFromContent(post.content)}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span className="truncate max-w-[50%]">
                      {post.userNickName}
                    </span>
                    <span>조회수 {post.viewCount}</span>
                    <span>댓글 {post.replyCount}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(post.createDate)}
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      {/* 비밀글 팝업 */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-bold mb-4">비밀번호를 입력하세요</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호 입력"
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => handleConfirmPassword(selectedPostId)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                확인
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
