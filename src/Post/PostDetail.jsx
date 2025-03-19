import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import bookmark from "../img/bookmark.png";
import noBookmark from "../img/noBookmark.png";

export default function PostDetail() {
  const location = useLocation();
  const { postId } = useParams();
  const navigate = useNavigate();

  const passedPost = location.state?.post;
  const [post, setPost] = useState(passedPost);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/post/${postId}`, { withCredentials: true })
      .then((res) => setPost(res.data))
      .catch((err) => console.error("게시글 불러오기 실패:", err));
  }, [postId]);

  if (!post) return <div>Loading...</div>;

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:8080/post/${postId}`, {
          withCredentials: true,
        })
        .then(() => {
          alert("삭제되었습니다.");
          navigate("/"); // 목록 페이지로 이동
        })
        .catch((err) => {
          console.error(err);
          alert("삭제 실패");
        });
    }
  };

  const goEdit = () => {
    navigate(`/post/edit/${postId}`, { state: { post } });
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-8">
      {/* 게시글 내용 */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* 상단 제목, 북마크 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-700">
              북마크 {post.bookmarkCount}
            </span>
            <img
              onClick={toggleBookmark}
              src={isBookmarked ? bookmark : noBookmark}
              alt="북마크"
              className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform"
            />
          </div>
        </div>

        {/* 작성일 */}
        <div className="text-sm text-gray-500 mb-2">
          작성일: {post.createDate}
        </div>

        {/* 작성자 / 조회수 */}
        <div className="flex justify-between text-gray-500 text-sm mb-4">
          <span>작성자: {post.userName}</span>
          <span>조회수: {post.viewCount}</span>
        </div>

        {/* 대표 이미지 */}
        <img
          src={`http://localhost:8080${post.titleImg}`}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        {/* 내용 */}
        <div className="text-lg mb-8 whitespace-pre-line">{post.content}</div>

        {/* 수정일 */}
        <div className="text-sm text-gray-500">수정일: {post.modifiedDate}</div>
      </div>

      {/* 수정 / 삭제 버튼 - 우측 하단 고정 */}
      <div className="fixed bottom-10 right-10 flex gap-4">
        <button
          onClick={goEdit}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
        >
          수정하기
        </button>
        <button
          onClick={handleDelete}
          className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}
