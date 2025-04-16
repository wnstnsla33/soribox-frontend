import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function UserInfoPopup({ userId, onClose }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/user/detail/${userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        setUser(res.data.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "유저 정보를 불러오지 못했습니다."
        );
        onClose();
      });
  }, [userId]);

  const handleJoinRoom = (roomId) => {
    window.location.href = `/room/${roomId}`;
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[450px] max-h-[600px] overflow-auto rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={`http://localhost:8080${user.userImg}`}
            alt="프로필"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-semibold">{user.userNickName}</h2>
          </div>
        </div>

        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">생년월일:</span> {user.userBirthDay}
          </p>
          <p>
            <span className="font-semibold">소개:</span>{" "}
            {user.userInfo || "없음"}
          </p>
          <p>
            <span className="font-semibold">레벨:</span> {user.userLevel}
          </p>
          <p>
            <span className="font-semibold">최근 접속:</span>{" "}
            {dayjs(user.recentLoginTime).format("YYYY-MM-DD HH:mm")}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">가입한 방</h3>
          {user.rooms.length === 0 ? (
            <p className="text-sm text-gray-400">가입한 방이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {user.rooms.map((room) => (
                <li
                  key={room.roomId}
                  className="flex items-center justify-between gap-2 text-sm border p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`http://localhost:8080${room.roomImg}`}
                      alt="방"
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {room.roomtitle} {room.private && "🔒"}
                      </p>
                      <p className="text-xs text-gray-500">{room.roomType}</p>
                      <p className="text-xs text-gray-500">
                        {room.curPaticipants} / {room.roomMaxParticipants} 명
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleJoinRoom(room.roomId)}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    참가하기
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
