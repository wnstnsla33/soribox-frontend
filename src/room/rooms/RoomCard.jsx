import React from "react";
import RoomMemberAvatar from "./RoomMemberAvatar";

export default function RoomCard({ room, onClick }) {
  const handleClick = () => {
    onClick(room.roomId);
  };

  const meetingTime = new Date(room.meetingTime);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const meetingDay = new Date(meetingTime);
  meetingDay.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((meetingDay - today) / (1000 * 60 * 60 * 24));

  const isPrivate = room.private;

  if (isPrivate) {
    return (
      <div
        className="w-full min-h-[240px] transition-transform duration-200 ease-in-out transform hover:scale-105 bg-white text-black border-gray-200 shadow-md rounded-xl p-6 border relative hover:shadow-lg cursor-pointer"
        onClick={handleClick}
      >
        {/* 우측 고정 이미지 */}
        <div className="absolute top-6 right-6 w-24 h-24">
          <img
            src={`http://localhost:8080/uploads/classicImage/privateRoom.png`}
            alt="private room"
            className="w-full h-full object-cover rounded-lg border"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="pr-36">
          <h3 className="text-xl font-bold mb-1 truncate">
            🔒 {room.roomTitle}
          </h3>
          <p className="text-sm text-red-500 mb-1">비밀방입니다.</p>
          {room.hostName && (
            <p className="text-sm text-gray-700">방장: {room.hostName}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full transition-transform duration-200 ease-in-out transform hover:scale-105 bg-white text-black border-gray-200 shadow-md rounded-xl p-6 border relative hover:shadow-lg cursor-pointer"
      onClick={handleClick}
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
        <h3 className="text-xl font-bold mb-1 truncate">{room.roomTitle}</h3>

        {room.roomType && (
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full border border-blue-200 truncate">
              {room.roomType}
            </span>
          </div>
        )}

        {room.curPaticipants != null && room.maxParticipants != null && (
          <p className="text-sm text-gray-600 mb-1">
            인원: {room.curPaticipants} / {room.maxParticipants}
          </p>
        )}

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

        {room.roomContent && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-2 break-words">
            {(room.roomContent ?? "")
              .replace(/<[^>]+>/g, "")
              .replace(/&nbsp;/g, " ")
              .trim()}
          </p>
        )}

        {room.roomMembers && <RoomMemberAvatar members={room.roomMembers} />}
      </div>
    </div>
  );
}
