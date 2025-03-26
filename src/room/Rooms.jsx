import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const enterRoom = (roomId) => {
    axios
      .get(`http://localhost:8080/chatRoom/${roomId}`, {
        withCredentials: true,
      })
      .then((res) => {
        navigate(`/room/${roomId}`);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data);
        navigate("/rooms");
      });
  };
  useEffect(() => {
    const fetchRooms = async () => {
      console.log("방 불러오기 실행");
      try {
        const res = await axios.get("http://localhost:8080/chatRoom", {
          withCredentials: true,
        });
        setRooms(res.data);
      } catch (err) {
        console.error("방 목록 불러오기 실패", err);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">방 목록</h2>
      <ul className="space-y-2">
        {rooms.map((room) => (
          <li key={room.roomId} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{room.roomTitle}</h3>
            <p>종류: {room.roomType}</p>
            <p>
              인원: {room.curPaticipants} / {room.maxParticipants}
            </p>
            <p>주최자: {room.hostName}</p>
            <Link
              onClick={() => enterRoom(room.roomId)}
              className="text-blue-500 hover:underline"
            >
              채팅방 입장
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
