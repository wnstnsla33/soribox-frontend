import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import UserProfilePopup from "../layout/UserProfiePopup";

export default function FriendListPopup({ onClose }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const res = await axios.get("http://localhost:8080/friends", {
        withCredentials: true,
      });
      setFriends(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || "친구 목록 불러오기 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-[400px] max-h-[500px] overflow-auto rounded-lg shadow-lg p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-3">친구 목록</h2>

        {loading ? (
          <p className="text-sm text-gray-500">불러오는 중...</p>
        ) : friends.length === 0 ? (
          <p className="text-sm text-gray-500">친구가 없습니다.</p>
        ) : (
          friends.map((friend) => (
            <div
              key={friend.fid}
              className="border-b py-2 flex items-start gap-3"
            >
              <UserProfilePopup
                userId={friend.friendsUserId}
                userNickname={friend.friendsNickName}
                userImg={friend.friendsImg}
                fromFriends={true}
              />

              <div>
                <p className="font-medium">{friend.friendsNickName}</p>
                <p className="text-xs text-gray-500">
                  마지막 접속:{" "}
                  {dayjs(friend.recentLoginTime).format("YYYY-MM-DD HH:mm")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
