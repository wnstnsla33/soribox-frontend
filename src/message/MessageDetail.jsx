import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MessageModal from "../admin/user/MessageModal";
export function MessageDetail() {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const { messageId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [showModal, setShowModal] = useState(false); // ✅ 모달 상태

  useEffect(() => {
    axios
      .get(`${BASE_URL}/messages/${messageId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessage(res.data.data); // CommonResponse.data
      })
      .catch((err) => {
        console.error("메시지 상세 조회 실패", err);
        alert(err.response.data.message);
        navigate(-1);
      });
  }, [messageId]);

  if (!message) {
    return (
      <div className="p-6 text-center">📨 메시지 정보를 불러오는 중...</div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">✉️ 메시지 상세</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)} // ✅ 모달 열기
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            답장하기
          </button>
          <button
            onClick={() => navigate(-1)}
            className="text-sm bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
          >
            뒤로가기
          </button>
        </div>
      </div>

      <div className="border rounded p-4 bg-white shadow">
        <div className="mb-2">
          <span className="font-semibold text-gray-600">제목:</span>{" "}
          <span className="text-lg">{message.title}</span>
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-600">보낸 사람:</span>{" "}
          {message.senderName}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-600">보낸 시간:</span>{" "}
          {new Date(message.sendDate).toLocaleString("ko-KR")}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-gray-600">타입:</span>{" "}
          <span className="text-blue-600">{message.messageType}</span>
        </div>
        <div className="mt-4 border-t pt-4">
          <span className="font-semibold text-gray-600">내용:</span>
          <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>

      {/* ✅ 답장 모달 */}
      {showModal && (
        <MessageModal
          toUser={{
            userId: message.senderId,
            userNickName: message.senderName,
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
