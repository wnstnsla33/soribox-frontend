import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoomMemberAvatars({ members }) {
  const navigate = useNavigate();

  const handleUserClick = (e, userId) => {
    e.stopPropagation(); // ✅ 행 클릭 방지
    navigate(`/admin/users/${userId}`); // ✅ 유저 상세로 이동
  };

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((member) => (
        <div
          key={member.userId}
          onClick={(e) => handleUserClick(e, member.userId)}
          className="flex items-center gap-1 cursor-pointer hover:bg-gray-100 p-1 rounded transition"
        >
          <img
            src={`http://localhost:8080${member.userImg}`}
            alt="avatar"
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
          <span className="text-sm text-gray-800">{member.userNickName}</span>
        </div>
      ))}
    </div>
  );
}
