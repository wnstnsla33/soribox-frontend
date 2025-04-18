import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MyMessageList() {
  const [messages, setMessages] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [isReceived, setIsReceived] = useState(true); // ✅ 상태 기반으로 관리
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;

  const fetchMessages = () => {
    axios
      .get(`${BASE_URL}/messages/${isReceived ? "received" : "sent"}`, {
        params: { keyword },
        withCredentials: true,
      })
      .then((res) => {
        const { data } = res.data;
        console.log(data);
        setMessages(data.data);
        setPageCount(data.pageCount);
        setUnreadCount(data.unReadMsgCount || 0);
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  useEffect(() => {
    fetchMessages();
  }, [isReceived]); // ✅ 상태 변경되면 새로 불러옴

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMessages(); // 검색 시 fetch
  };
  console.log(messages);
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">
        {isReceived ? "📨 받은 메시지" : "📤 보낸 메시지"}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="상대 닉네임 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded p-1 px-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            검색
          </button>
        </form>
        <div className="flex gap-4 text-sm text-blue-700 font-medium">
          <button
            onClick={() => setIsReceived(true)}
            className={`hover:underline ${isReceived ? "font-bold" : ""}`}
          >
            받은 메시지
          </button>
          <button
            onClick={() => setIsReceived(false)}
            className={`hover:underline ${!isReceived ? "font-bold" : ""}`}
          >
            보낸 메시지
          </button>
        </div>
      </div>

      {isReceived && (
        <div className="mb-2 text-sm text-gray-600">
          안 읽은 메시지:{" "}
          <span className="font-semibold text-red-500">{unreadCount}</span>
        </div>
      )}

      <table className="w-full border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">제목</th>
            <th className="p-2">{isReceived ? "보낸 사람" : "받는 사람"}</th>
            <th className="p-2">날짜</th>
            <th className="p-2">읽음 여부</th>
          </tr>
        </thead>
        <tbody>
          {messages.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-400">
                메시지가 없습니다.
              </td>
            </tr>
          ) : (
            messages.map((msg) => (
              <tr
                key={msg.messageId}
                onClick={() => navigate(`/messages/${msg.messageId}`)}
                className={`cursor-pointer transition hover:bg-blue-100 ${
                  msg.read ? "bg-white" : "bg-blue-50 font-semibold"
                }`}
              >
                <td className="p-2">{msg.title}</td>
                <td className="p-2">
                  {isReceived ? msg.senderName : msg.receiverName}
                </td>
                <td className="p-2">
                  {new Date(msg.sendDate).toLocaleString("ko-KR")}
                </td>
                <td className="p-2">
                  {msg.read ? (
                    <span className="text-gray-500">읽음</span>
                  ) : (
                    <span className="text-blue-600">안 읽음</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
