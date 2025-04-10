import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserChatLog from "./UserChatLog";
import UserHostLog from "./UserHostLog";
export default function UserDetailByAdmin() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("chats");

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/admin/user/${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res);
      setUser(res.data.data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  if (!user) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">
        🙍‍♂️ {user.userNickName || "닉네임 없음"} 상세 정보
      </h2>

      <div className="bg-white border rounded p-4 mb-6 shadow-md">
        <p>
          <strong>이메일:</strong> {user.userEmail}
        </p>
        <p>
          <strong>이름:</strong> {user.userName}
        </p>
        <p>
          <strong>가입일:</strong>{" "}
          {new Date(user.userCreateDate).toLocaleDateString()}
        </p>
        <p>
          <strong>성별:</strong> {user.userSex}
        </p>
        <p>
          <strong>한줄소개:</strong> {user.userInfo || "없음"}
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setTab("chats")}
          className={`px-4 py-2 rounded ${
            tab === "chats" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          💬 채팅 보기
        </button>
        <button
          onClick={() => setTab("rooms")}
          className={`px-4 py-2 rounded ${
            tab === "rooms" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          🏠 참여 방 보기
        </button>
      </div>

      {tab === "chats" && <UserChatLog userId={userId} />}
      {tab === "rooms" && <UserHostLog userId={userId} />}
    </div>
  );
}
