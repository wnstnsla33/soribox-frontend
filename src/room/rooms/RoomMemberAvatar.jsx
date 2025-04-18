import React from "react";

export default function RoomMemberAvatar({ members = [] }) {
  const BASE_URL = process.env.REACT_APP_API_URL;
  return (
    <div className="flex items-center gap-[-0.5rem] mt-4 relative z-10">
      {members.slice(0, 5).map((member, idx) => (
        <div key={idx} className="relative group">
          <img
            src={`${BASE_URL}${member.userImg}`}
            alt={member.userNickName}
            className="w-8 h-8 rounded-full border-2 border-white -ml-2 first:ml-0 object-cover"
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 whitespace-nowrap pointer-events-none">
            <div className="font-semibold">{member.userNickName}</div>
            <div className="text-gray-300">
              {member.userInfo || "소개 없음"}
            </div>
          </div>
        </div>
      ))}
      {members.length > 5 && (
        <span className="text-xs text-gray-500 ml-2">
          +{members.length - 5}
        </span>
      )}
    </div>
  );
}
