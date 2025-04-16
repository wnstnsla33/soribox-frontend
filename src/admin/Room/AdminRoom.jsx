import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminRoomContextMenu from "./AdminRoomContextMenu";
import RoomMemberAvatars from "./RoomMemberAvatar";
import { useNavigate } from "react-router-dom";

export default function AdminRoom() {
  const [rooms, setRooms] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [contextMenu, setContextMenu] = useState(null); // {x, y, room}
  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:8080/admin/room", {
        params: { page, name: keyword },
        withCredentials: true,
      });
      setRooms(res.data.data);
      setTotalPages(res.data.pages);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [page, keyword]);

  const handleDelete = async (roomId) => {
    const confirmed = window.confirm(`해당 채팅방을 삭제할까요?`);
    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `http://localhost:8080/admin/room/${roomId}`,
        {
          withCredentials: true,
        }
      );
      alert(res.data?.message);
      fetchRooms();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleView = (room) => {
    navigate(`/room/${room.roomId}`);
  };

  const handleContextMenu = (e, room) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, room });
  };

  const closeContextMenu = () => setContextMenu(null);

  useEffect(() => {
    document.addEventListener("click", closeContextMenu);
    return () => document.removeEventListener("click", closeContextMenu);
  }, []);

  return (
    <div className="p-8 relative">
      <h2 className="text-2xl font-bold mb-6">💬 관리자 채팅방 목록</h2>

      <input
        type="text"
        placeholder="방 제목 검색"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded mb-6 w-64"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">방 이름</th>
              <th className="px-4 py-2 border">생성자</th>
              <th className="px-4 py-2 border">생성일</th>
              <th className="px-4 py-2 border">참여 인원</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr
                key={room.roomId}
                onClick={() => handleView(room)} // ✅ 클릭 시 상세 이동
                onContextMenu={(e) => handleContextMenu(e, room)}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-2 border">
                  {room.private && (
                    <span className="ml-2 text-red-500">🔒</span>
                  )}
                  {room.roomTitle}
                </td>
                <td className="px-4 py-2 border">{room.hostName}</td>
                <td className="px-4 py-2 border">
                  {new Date(room.roomCreatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  <RoomMemberAvatars members={room.roomMembers} />
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
        <AdminRoomContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          roomId={contextMenu.room.roomId}
          roomTitle={contextMenu.room.roomTitle}
          onDelete={() => handleDelete(contextMenu.room.roomId)}
          onClose={closeContextMenu}
        />
      )}
    </div>
  );
}
