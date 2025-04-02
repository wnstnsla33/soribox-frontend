import React from "react";
import RoomMemberAvatar from "./RoomMemberAvatar";

export default function RoomCard({ room, onClick }) {
  const meetingTime = new Date(room.meetingTime);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const meetingDay = new Date(meetingTime);
  meetingDay.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((meetingDay - today) / (1000 * 60 * 60 * 24));

  return (
    <div
      className="w-full transition-transform duration-200 ease-in-out transform hover:scale-105 bg-white shadow-md rounded-xl p-6 border border-gray-200 relative"
      onClick={() => onClick(room.roomId)}
    >
      {diffDays >= 0 && diffDays <= 2 && (
        <div className="absolute top-3 right-3 z-20">
          <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full shadow">
            {diffDays === 0 ? "D-Day" : `D-${diffDays}`}
          </span>
        </div>
      )}

      {room.roomImg && (
        <div className="absolute top-3 right-3 mt-8 z-10">
          <img
            src={`http://localhost:8080${room.roomImg}`}
            alt="room"
            className="w-28 h-28 rounded-lg object-cover border"
          />
        </div>
      )}

      <div className="pr-36">
        <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">
          {room.roomTitle}
        </h3>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 truncate">
            {room.roomType}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-1">
          인원: {room.curPaticipants} / {room.maxParticipants}
        </p>

        {room.meetingTime && (
          <p className="text-sm text-gray-700 truncate">
            {meetingTime.toLocaleString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        )}

        <p className="text-sm text-gray-700 mt-2 line-clamp-2 break-words">
          {room.roomContent
            .replace(/<[^>]+>/g, "")
            .replace(/&nbsp;/g, " ")
            .trim()}
        </p>

        <RoomMemberAvatar members={room.roomMembers} />
      </div>
    </div>
  );
}
