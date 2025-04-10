import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../store/userSlice";
import useChatSocket from "./useChatSocket";
import ChatMessage from "./ChatMessage";
import axios from "axios";
import "./ChatRoom.css";
import ReportButton from "../report/ReportButton";

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);

  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const chatBoxRef = useRef(null);

  // ✅ user가 있을 때만 hook 실행
  const { messages, sendMessage, leaveRoom, setMessages } = useChatSocket(
    user ? { roomId, user } : { roomId, user: null }
  );

  const fetchRoomInfo = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/chatRoom/${roomId}`, {
        withCredentials: true,
      });
      const room = res.data.data;

      if (room.private && !room.roomContent) {
        setShowPasswordPrompt(true);
      } else {
        setRoomInfo(room);
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
      navigate("/");
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/chatRoom/${roomId}/messages`,
        { withCredentials: true }
      );
      setMessages(res.data.data);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const verifyPassword = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/chatRoom/${roomId}/verify`,
        { password: passwordInput },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setShowPasswordPrompt(false);
        setRoomInfo(res.data.data);
        await fetchMessages();
      }
    } catch (err) {
      setErrorMessage(err.response?.data.message || "비밀번호 확인 실패");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await dispatch(fetchUserInfo()).unwrap();
        console.log("🟢 유저 정보 불러오기 성공:", result);
      } catch (err) {
        console.log("🔥 fetchUserInfo 에러:", err); // <- 여기에 뜬다!
        console.log(err);
        // err는 rejectWithValue()로 전달한 값임
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      fetchRoomInfo();
    }
  }, [roomId, user]);

  useEffect(() => {
    if (roomInfo) {
      fetchMessages();
    }
  }, [roomInfo]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleExit = () => navigate("/");

  const handleLeaveRoom = async () => {
    if (roomInfo.hostName === user?.userName) {
      const confirmDelete = window.confirm(
        "이 방은 삭제됩니다. 정말 나가시겠습니까?"
      );
      if (!confirmDelete) return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:8080/chatRoom/${roomId}`,
        { withCredentials: true }
      );
      alert(res.data.message);
      leaveRoom();
      navigate("/");
    } catch (err) {
      console.error(err.response.message);
      alert("방 나가기 실패!");
    }
  };

  if (!user) return null;

  if (showPasswordPrompt) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg w-72 text-center">
          <h4 className="mb-3 text-lg font-semibold text-gray-800">
            비밀번호 입력
          </h4>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-2"
            placeholder="비밀번호"
          />
          {errorMessage && (
            <p className="text-sm text-red-600 mb-2">{errorMessage}</p>
          )}
          <div className="flex justify-between gap-2">
            <button
              onClick={() => navigate("/")}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              취소
            </button>
            <button
              onClick={verifyPassword}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!roomInfo) return null;

  return (
    <div className="chat-room-wrapper styled-theme">
      <div className="room-info-panel relative">
        <div className="absolute top-2 right-2">
          <ReportButton targetId={roomInfo.roomId} targetType="ROOM" />
        </div>

        <h3>{roomInfo.roomTitle}</h3>
        <p>
          <strong>방장:</strong> {roomInfo.hostName}
        </p>
        <p>
          <strong>참여 인원:</strong> {roomInfo.curPaticipants} /{" "}
          {roomInfo.maxParticipants}
        </p>
        <p>
          <strong>유형:</strong> {roomInfo.roomType}
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: roomInfo.roomContent || "" }}
          className="room-content-wrapper"
        ></div>
      </div>

      <div className="chat-room-container">
        <div className="chat-header">
          <h2 className="chat-title">채팅방</h2>
          <button className="exit-button" onClick={handleExit}>
            나가기
          </button>
          <button className="exit-button danger" onClick={handleLeaveRoom}>
            방 탈퇴
          </button>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((chat, idx) => (
            <ChatMessage
              key={idx}
              chat={chat}
              isMine={chat.senderName === user?.userName}
            />
          ))}
        </div>

        <div className="chat-input-wrap">
          <input
            autoFocus
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="메시지를 입력하세요"
          />
          <button className="send-button" onClick={handleSend}>
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
