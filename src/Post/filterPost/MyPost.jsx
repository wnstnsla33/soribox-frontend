import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MyPost() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const getMyList = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/post/myPost`, {
        withCredentials: true,
      });
      setPosts(res.data.data || []);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyList();
  }, []);

  const handleDelete = (postId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:8080/post/${postId}`, {
          withCredentials: true,
        })
        .then(() => {
          alert("삭제되었습니다.");
          getMyList(); // Refresh the list after deletion
        })
        .catch((err) => {
          console.error(err);
          alert("삭제 실패");
        });
    }
  };

  if (!posts || posts.length === 0) return <div>글을 등록해주세요</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">내가 작성한 글</h2>
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="p-4 border rounded-lg shadow mb-4 flex justify-between items-center"
          >
            <Link to={`/post/${post.postId}`} className="flex-1">
              <h3 className="text-lg font-semibold">{post.title}</h3>
              <div className="mt-2 text-sm text-gray-500">
                <span>작성자: {post.userName} | </span>
                <span>조회수: {post.viewCount} | </span>
                <span>북마크: {post.bookmarkCount}</span>
              </div>
            </Link>
            <button
              onClick={() => handleDelete(post.postId)}
              className="text-red-500 text-sm hover:text-red-700"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
