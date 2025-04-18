import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UserHostLog({ userId }) {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;
  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/room/${userId}`, {
        withCredentials: true,
      });
      console.log(res);
      setRooms(res.data.data);
    } catch (err) {
      console.error("방 목록 로딩 실패", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [userId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🏠 참여한 방 목록</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.length === 0 && <p>참여한 방이 없습니다.</p>}
        {rooms.map((room) => (
          <div
            key={room.roomId}
            onClick={() => navigate(`/admin/rooms/${room.roomId}`)}
            className="border p-4 rounded shadow hover:bg-gray-100 cursor-pointer"
          >
            <div className="text-lg font-semibold">{room.roomTitle}</div>
            <div className="text-sm text-gray-600">ID: {room.roomId}</div>
            <div className="text-sm text-gray-500">
              인원: {room.curPaticipants}
            </div>
            <div className="text-sm text-gray-400">
              {new Date(room.roomCreatedAt).toLocaleDateString()}
            </div>
            {room.private && (
              <div className="text-xs text-red-500 font-semibold mt-1">
                🔒 비공개 방
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
