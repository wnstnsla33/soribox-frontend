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
        { withCredentials: true }
      );
      setUser(res.data.data);
    } catch (err) {
      console.error("유저 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);
  console.log(user);
  if (!user) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">
        🙍‍♂️ {user.userNickName || "닉네임 없음"} 상세 정보
      </h2>

      <div className="flex bg-white border rounded p-4 mb-6 shadow-md">
        {/* 왼쪽: 텍스트 정보 */}
        <div className="flex-1 space-y-2">
          <p>
            <strong>이메일:</strong> {user.userEmail}
          </p>
          <p>
            <strong>이름:</strong> {user.userName}
          </p>
          <p>
            <strong>나이:</strong> {user.userAge}세
          </p>
          <p>
            <strong>성별:</strong> {user.userSex}
          </p>
          <p>
            <strong>등급:</strong> {user.userGrade}
          </p>
          <p>
            <strong>레벨:</strong> Lv.{user.userLevel} (Exp: {user.userExp})
          </p>
          <p>
            <strong>가입일:</strong> {user.userCreateDate}
          </p>
          <p>
            <strong>생일:</strong> {user.userBirthDay}
          </p>
          <p>
            <strong>한줄소개:</strong> {user.userInfo || "없음"}
          </p>
          <p>
            <strong>최근 로그인:</strong>{" "}
            {user.recentLoginTime
              ? new Date(user.recentLoginTime).toLocaleString()
              : "정보 없음"}
          </p>
          <p>
            <strong>신고 받은 횟수:</strong> {user.reportedCount}
          </p>
          <p>
            <strong>게시글 수:</strong> {user.postCount}
          </p>
          <p>
            <strong>댓글 수:</strong> {user.replyCount}
          </p>
          <p>
            <strong>참여방 수:</strong> {user.roomCount}
          </p>
        </div>

        {/* 오른쪽: 프로필 이미지 */}
        <div className="ml-6">
          <img
            src={`http://localhost:8080${user.userImg}`}
            alt="프로필 이미지"
            className="w-40 h-40 object-cover rounded-lg border"
          />
        </div>
      </div>

      {/* 하단 탭 */}
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
