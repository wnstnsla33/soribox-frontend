import React from "react";
import { useNavigate } from "react-router-dom";

export default function RoomMemberAvatars({ members }) {
  const navigate = useNavigate();

  if (!members || members.length === 0) return <span>-</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {members.map((member, idx) => (
        <button
          key={idx}
          onClick={() => navigate(`/admin/users/${member.userId}`)}
          className="text-blue-600 hover:underline"
        >
          {member.userNickName || "닉네임 없음"}
        </button>
      ))}
    </div>
  );
}
