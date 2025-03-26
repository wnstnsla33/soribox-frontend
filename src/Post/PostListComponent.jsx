import { useState } from "react";
import { Link } from "react-router-dom";
import bookmark from "../img/bookmark.png";
import noBookmark from "../img/noBookmark.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
export default function PostListComponent({
  posts,
  userBookmarks,
  ClickBookmark,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const navigater = useNavigate();
  const handleSecretPostClick = (postId) => {
    setSelectedPostId(postId);
    setShowPopup(true);
  };

  const handleConfirmPassword = async (postId) => {
    console.log("입력한 비밀번호:", password);
    try {
      const res = await axios.post(
        `http://localhost:8080/post/secrete/${postId}`,
        { pwd: password },
        { withCredentials: true }
      );

      // 성공적으로 데이터를 받으면 해당 게시글 상세 페이지로 이동
      setShowPopup(false);
      setPassword("");
      navigater(`/post/${postId}`, { state: { post: res.data } });
    } catch (err) {
      console.error("비밀번호 검증 실패:", err);
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleCancel = () => {
    setShowPopup(false);
    setPassword("");
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {posts.map((post) =>
          post.title === "비밀글" ? (
            <div
              key={post.postId}
              onClick={() => handleSecretPostClick(post.postId)}
              className="cursor-pointer bg-gray-200 rounded-2xl shadow-lg overflow-hidden relative hover:shadow-2xl transition flex items-center justify-center h-60"
            >
              <span className="text-gray-600 font-bold">🔒 비밀글</span>
            </div>
          ) : (
            <Link
              key={post.postId}
              to={`/post/${post.postId}`}
              state={{ post }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative hover:shadow-2xl transition">
                {/* 대표 이미지 */}
                <div className="relative h-60">
                  <img
                    src={`http://localhost:8080${post.titleImg}`}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />

                  {/* 북마크 */}
                  <img
                    src={userBookmarks.has(post.postId) ? bookmark : noBookmark}
                    alt="북마크"
                    onClick={(e) => {
                      e.preventDefault(); // 클릭해도 상세 페이지 이동 방지
                      ClickBookmark(post.postId);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 cursor-pointer hover:scale-110 transition-transform"
                  />
                </div>

                {/* 제목 */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 truncate">
                    {post.title} + {post.bookmarkCount}
                  </h3>

                  {/* 작성자, 조회수 */}
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{post.userName}</span>
                    <span>조회수 {post.viewCount}</span>
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>

      {/* 비밀번호 입력 팝업 */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
