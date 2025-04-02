import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyRooms() {
  const [myRooms, setMyRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/chatRoom/hostRooms",
          {
            withCredentials: true,
          }
        );
        setMyRooms(res.data || []);
      } catch (err) {
        console.error("방 목록 불러오기 실패", err);
        setMyRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const now = new Date();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">내가 참여한 방</h1>

      {isLoading ? (
        <p className="text-gray-500">로딩 중입니다...</p>
      ) : myRooms.length === 0 ? (
        <p className="text-gray-500">참여한 방이 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myRooms.map((room) => {
            const isExpired = new Date(room.meetingTime) < now;

            return (
              <div
                key={room.roomId}
                onClick={() => navigate(`/room/${room.roomId}`)}
                className={`cursor-pointer p-4 rounded-xl shadow-md border transition-all hover:scale-[1.01] ${
                  isExpired ? "bg-gray-100 text-gray-400" : "bg-white"
                }`}
              >
                <h2 className="text-lg font-semibold">{room.roomTitle}</h2>
                <p>유형: {room.roomType}</p>
                <p>
                  참여 인원: {room.curPaticipants} / {room.maxParticipants}
                </p>
                <p>
                  모임 일시:{" "}
                  {room.meetingTime
                    ? new Date(room.meetingTime).toLocaleString()
                    : "미정"}
                </p>
                <p>방장: {room.hostName}</p>

                {isExpired && (
                  <p className="mt-2 font-semibold text-red-500">
                    기한이 지났습니다.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
