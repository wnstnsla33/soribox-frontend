import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import UserContextMenu from "./UserContextMenu";
import MessageModal from "./MessageModal";

export default function AdminUser() {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [contextMenu, setContextMenu] = useState(null);
  const contextRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageTargetUser, setMessageTargetUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/user`, {
        params: { page, name: keyword },
        withCredentials: true,
      });
      console.log(res);
      setUsers(res.data.data.data);
      setTotalPages(res.data.data.pages);
    } catch (error) {
      console.error("유저 목록 불러오기 실패", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, keyword]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (contextRef.current && !contextRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

  const handleRightClick = (e, user) => {
    e.preventDefault();
    setContextMenu({
      user,
      x: e.pageX,
      y: e.pageY,
    });
  };

  const openMessageModal = (targetUser) => {
    setMessageTargetUser(targetUser);
    setShowMessageModal(true);
    setContextMenu(null); // 메뉴 닫기
  };

  const closeContextMenu = () => setContextMenu(null);

  return (
    <div className="p-8 relative">
      <h2 className="text-2xl font-bold mb-6">👤 관리자 유저 목록</h2>

      <input
        type="text"
        placeholder="이름으로 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded mb-6 w-64"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">이메일</th>
              <th className="px-4 py-2 border">닉네임</th>
              <th className="px-4 py-2 border">이름</th>
              <th className="px-4 py-2 border">등급</th>
              <th className="px-4 py-2 border">레벨</th>
              <th className="px-4 py-2 border">최근 로그인</th>
              <th className="px-4 py-2 border">신고 횟수</th> {/* ✅ 추가 */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.userEmail}
                className="hover:bg-gray-50 transition-colors"
                onContextMenu={(e) => handleRightClick(e, user)}
              >
                <td className="px-4 py-2 border">{user.userEmail}</td>
                <td className="px-4 py-2 border">{user.userNickName}</td>
                <td className="px-4 py-2 border">{user.userName}</td>
                <td className="px-4 py-2 border">{user.userGrade}</td>
                <td className="px-4 py-2 border">{user.userLevel}</td>
                <td className="px-4 py-2 border">
                  {new Date(user.recentLoginTime).toLocaleString()}
                </td>
                <td className="px-4 py-2 border text-red-500 font-semibold">
                  {user.reportCount || 0}회
                </td>
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
        <div ref={contextRef}>
          <UserContextMenu
            user={contextMenu.user}
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={closeContextMenu}
            onSendMessage={() => openMessageModal(contextMenu.user)} // ✅ 추가
          />
        </div>
      )}

      {showMessageModal && messageTargetUser && (
        <MessageModal
          toUser={messageTargetUser}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
}
