import React, { useState } from "react";
import axios from "axios";

export default function MessageModal({ toUser, onClose }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("NORMAL"); // 기본 메시지 타입
  const BASE_URL = process.env.REACT_APP_API_URL;
  const sendMessage = () => {
    if (!title.trim()) return alert("제목을 입력하세요.");
    if (!message.trim()) return alert("메시지를 입력하세요.");

    axios
      .post(
        `${BASE_URL}/messages`,
        {
          title: title,
          content: message,
          receiverId: toUser.userId,
          type: type, // enum: "NORMAL", "NOTICE", "WARNING"
        },
        { withCredentials: true }
      )
      .then(() => {
        alert("메시지를 보냈습니다.");
        onClose();
      })
      .catch((err) => {
        console.error("메시지 전송 실패", err);
        alert(err.response?.data?.message || "메시지 전송에 실패했습니다.");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          ✉️ {toUser.userNickName} 님에게 메시지 보내기
        </h2>

        {/* 제목 입력 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded p-2 mb-2"
          placeholder="제목을 입력하세요..."
        />

        <textarea
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded p-2 mb-4"
          placeholder="메시지를 입력하세요..."
        />

        {/* 버튼 영역 */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            닫기
          </button>
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}
