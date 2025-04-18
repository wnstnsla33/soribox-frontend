import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminContextMenu from "./AdminContextMenu";

export default function AdminPost() {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [contextMenu, setContextMenu] = useState(null); // {x, y, post}
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/post`, {
        params: { page, name: keyword },
        withCredentials: true,
      });
      setPosts(res.data.data);
      setTotalPages(res.data.pages);
    } catch (error) {
      console.error("게시글 목록 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, keyword]);

  const handleDelete = async (post) => {
    const confirmed = window.confirm(`'${post.title}' 게시글을 삭제할까요?`);
    if (!confirmed) return;
    try {
      await axios.delete(`${BASE_URL}/admin/post/${post.postId}`, {
        withCredentials: true,
      });
      alert("삭제되었습니다.");
      fetchPosts();
    } catch (error) {
      console.error("게시글 삭제 실패", error);
      alert("삭제 중 오류 발생");
    }
  };

  const handleView = (post) => {
    navigate(`/admin/post/${post.postId}`, { state: { post } });
  };

  const handleContextMenu = (e, post) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, post });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    const close = () => closeContextMenu();
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div className="p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">📝 관리자 게시글 목록</h2>
        <button
          onClick={() => navigate("/admin/post/write")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          ✏️ 공지 쓰기
        </button>
      </div>

      <input
        type="text"
        placeholder="제목 또는 작성자 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded mb-6 w-64"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">제목</th>
              <th className="px-4 py-2 border">작성자</th>
              <th className="px-4 py-2 border">작성일</th>
              <th className="px-4 py-2 border">조회수</th>
              <th className="px-4 py-2 border">북마크</th>
              <th className="px-4 py-2 border">댓글수</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.postId}
                onClick={() => handleView(post)} // ✅ 클릭 시 상세 이동
                onContextMenu={(e) => handleContextMenu(e, post)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-2 border">{post.title}</td>
                <td className="px-4 py-2 border">{post.userName}</td>
                <td className="px-4 py-2 border">
                  {new Date(post.createDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">{post.viewCount}</td>
                <td className="px-4 py-2 border">{post.bookmarkCount}</td>
                <td className="px-4 py-2 border">{post.replyCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx)}
            className={`px-4 py-2 rounded ${
              idx === page
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {contextMenu && (
        <AdminContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={closeContextMenu}
          postId={contextMenu.post.postId}
          postTitle={contextMenu.post.title}
          onView={() => handleView(contextMenu.post)}
          onDeleteSuccess={fetchPosts}
        />
      )}
    </div>
  );
}
