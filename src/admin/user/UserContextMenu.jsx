import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MessageModal from "./MessageModal";
export default function UserContextMenu({
  user,
  x,
  y,
  onClose,
  onSendMessage,
}) {
  const navigate = useNavigate();

  const handleOptionClick = (action) => {
    onClose();

    switch (action) {
      case "정보보기":
        navigate(`/admin/users/${user.userId}`);
        break;
      case "댓글보기":
        navigate(`/admin/users/${user.userId}?tab=replies`);
        break;
      case "방보기":
        navigate(`/admin/users/${user.userId}?tab=rooms`);
        break;
      default:
        break;
    }
  };

  const deleteUser = () => {
    const confirmed = window.confirm(
      `${user.userName} 님을 정말 삭제하시겠습니까?`
    );
    if (!confirmed) return;

    axios
      .delete(`http://localhost:8080/admin/user/${user.userId}`, {
        withCredentials: true,
      })
      .then(() => {
        alert("삭제되었습니다.");
        onClose();
        window.location.reload();
      })
      .catch((err) => {
        console.error("삭제 실패", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
  };

  return (
    <ul
      className="absolute bg-white border border-gray-300 shadow-lg rounded z-50 w-48"
      style={{ top: `${y}px`, left: `${x + 10}px` }}
    >
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleOptionClick("정보보기")}
      >
        👁️ 정보 보기
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={onSendMessage}
      >
        ✉️ 메시지 보내기
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleOptionClick("댓글보기")}
      >
        💬 댓글 보기
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleOptionClick("방보기")}
      >
        🏠 방 보기
      </li>
      <li
        className="px-4 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
        onClick={deleteUser}
      >
        ❌ 삭제하기
      </li>
    </ul>
  );
}
