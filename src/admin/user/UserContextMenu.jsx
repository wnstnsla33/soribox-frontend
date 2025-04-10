import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function UserContextMenu({ user, x, y, onClose }) {
  const navigate = useNavigate();
  const handleOptionClick = () => {
    onClose(); // 메뉴 닫기
    navigate(`/admin/users/${user.userId}`);
  };

  const deleteUser = () => {
    const confirmed = window.confirm(
      `${user.userName} 님을 정말 삭제하시겠습니까?`
    );
    if (!confirmed) return;
    console.log(user);
    axios
      .delete(`http://localhost:8080/admin/user/${user.userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        alert("삭제되었습니다.");
        onClose(); // 삭제 후 메뉴 닫기
        // 필요하면 목록 다시 불러오는 함수 호출
        window.location.reload(); // 임시: 전체 새로고침 (향후 리팩토링 가능)
      })
      .catch((err) => {
        console.error("삭제 실패", err);
        alert("삭제 중 오류가 발생했습니다.");
      });
  };

  return (
    <ul
      className="absolute bg-white border border-gray-300 shadow-lg rounded z-50 w-48"
      style={{
        top: `${y}px`,
        left: `${x + 10}px`, // 마우스 우측으로 10px 이동
      }}
    >
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleOptionClick("정보보기")}
      >
        👁️ 정보 보기
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleOptionClick("작성한 글 보기")}
      >
        📝 작성한 글 보기
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleOptionClick("댓글 보기")}
      >
        💬 댓글 보기
      </li>
      <li
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleOptionClick("방 보기")}
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
