import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserChatLog({ userId }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [roomKeyword, setRoomKeyword] = useState("");
  const loader = useRef();
  const BASE_URL = process.env.REACT_APP_API_URL;
  // ✅ 채팅 데이터 가져오기
  const fetchChats = async (pageNumber, keyword) => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/chat/${userId}`, {
        params: { page: pageNumber, room: keyword },
        withCredentials: true,
      });
      const newChats = res.data.data;
      setChats((prev) => [...prev, ...newChats]);
      setHasMore(pageNumber + 1 < res.data.pages);
    } catch (error) {
      console.error("채팅 로딩 실패", error);
    }
  };

  // ✅ 무한 스크롤 핸들러
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore]
  );

  // ✅ page, 검색어 바뀔 때 fetch
  useEffect(() => {
    fetchChats(page, roomKeyword);
  }, [page, roomKeyword]);

  // ✅ roomKeyword 바뀔 때 page와 목록 초기화
  useEffect(() => {
    setChats([]);
    setPage(0);
  }, [roomKeyword]);

  // ✅ IntersectionObserver 연결
  useEffect(() => {
    const option = { root: null, rootMargin: "20px", threshold: 1.0 };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <input
          type="text"
          value={roomKeyword}
          onChange={(e) => setRoomKeyword(e.target.value)}
          placeholder="방 이름으로 검색"
          className="border px-3 py-1 rounded w-64"
        />
      </div>

      {chats.map((chat) => (
        <div
          key={chat.chatId}
          onClick={() => navigate(`/admin/rooms/${chat.roomId}`)}
          className="border rounded p-2 shadow-sm bg-white hover:bg-gray-100 hover:underline cursor-pointer transition"
        >
          <div className="flex justify-between items-start text-xs text-gray-500 mb-1">
            <span className="text-gray-600 font-medium">
              🏠 방명 : {chat.roomTitle}
            </span>
            <span>{new Date(chat.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
            {chat.msg}
          </div>
        </div>
      ))}

      <div ref={loader} className="h-10" />
    </div>
  );
}
