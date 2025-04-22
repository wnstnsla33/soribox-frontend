import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../store/userSlice";
import useChatSocket from "./useChatSocket";
import ChatMessage from "./ChatMessage";
import axios from "axios";
import "./ChatRoom.css";
import ReportButton from "../report/ReportButton";
import UserProfilePopup from "../layout/UserProfiePopup";

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  console.log("업데이트됨 18 42");
  const inputRef = useRef();
  const passwordInputRef = useRef();
  const chatBoxRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const BASE_IMG = process.env.REACT_APP_IMG_URL;

  const [roomWithChat, setRoomWithChat] = useState(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleEnterUser = (newUser) => {
    setRoomWithChat((prev) => {
      if (!prev || !newUser) return prev;
      const exists = prev.roomData.roomMembers?.some(
        (m) => m.userId === newUser.userId
      );
      if (exists) return prev;
      return {
        ...prev,
        roomData: {
          ...prev.roomData,
          roomMembers: [...(prev.roomData.roomMembers || []), newUser],
          curPaticipants: prev.roomData.curPaticipants + 1,
        },
      };
    });
  };

  const { messages, sendMessage, leaveRoom, setMessages } = useChatSocket(
    user
      ? { roomId, user, onUserEnter: handleEnterUser }
      : { roomId, user: null }
  );

  const fetchRoomWithChat = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/chatRoom/${roomId}`, {
        withCredentials: true,
      });
      const data = res.data.data;
      if (data.roomData.private && !data.roomData.roomContent) {
        setShowPasswordPrompt(true);
      } else {
        setRoomWithChat(data);
        setMessages(data.messages);
      }
    } catch (err) {
      alert(err.response?.data?.message || "방 조회 실패");
      navigate("/");
    }
  };

  const verifyPassword = async () => {
    const pwd = passwordInputRef.current.value.trim();
    try {
      const res = await axios.post(
        `${BASE_URL}/chatRoom/${roomId}/verify`,
        { password: pwd },
        { withCredentials: true }
      );
      setRoomWithChat(res.data.data);
      setMessages(res.data.data.messages);
      setShowPasswordPrompt(false);
    } catch (err) {
      setErrorMessage(err.response?.data.message || "비밀번호 확인 실패");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!user) {
        try {
          await dispatch(fetchUserInfo()).unwrap();
        } catch {
          navigate("/");
          return;
        }
      }
      await fetchRoomWithChat();
    };
    init();
  }, [dispatch, roomId]);

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    const input = inputRef.current.value.trim();
    if (!input) return;
    sendMessage(input);
    inputRef.current.value = ""; // ✅ 비우기
  };

  const handleExit = () => navigate("/");

  const handleLeaveRoom = async () => {
    if (roomWithChat?.roomData?.hostName === user?.userName) {
      const confirmDelete = window.confirm(
        "이 방은 삭제됩니다. 정말 나가시겠습니까?"
      );
      if (!confirmDelete) return;
    }
    try {
      const res = await axios.delete(`${BASE_URL}/chatRoom/${roomId}`, {
        withCredentials: true,
      });
      alert(res.data.message);
      leaveRoom();
      navigate("/");
    } catch (err) {
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
            ref={passwordInputRef}
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

  if (!roomWithChat) return null;

  const { roomData } = roomWithChat;

  return (
    <div className="chat-room-wrapper styled-theme">
      <div className="room-info-panel relative">
        <div className="absolute top-2 right-2">
          <ReportButton targetId={roomData.roomId} targetType="ROOM" />
        </div>
        <h3>{roomData.roomTitle}</h3>
        <p>
          <strong>방장:</strong> {roomData.hostName}
        </p>
        <p>
          <strong>유형:</strong> {roomData.roomType}
        </p>
        <p>
          <strong>모임 시간:</strong>{" "}
          {roomData.meetingTime ? roomData.meetingTime : "미정"}
        </p>
        <p>
          <strong>지역:</strong> {roomData.sido} {roomData.sigungu}
        </p>
        <p>
          <strong>참여 인원:</strong> {roomData.curPaticipants} /{" "}
          {roomData.maxParticipants}
        </p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {roomData.roomMembers?.map((member, idx) => (
            <UserProfilePopup
              key={idx}
              userImg={member.userImg}
              userNickname={member.userNickName}
              userId={member.userId}
              isHost={user.userId == roomData.hostId}
              fromRoom={true}
              roomId={roomId}
              isMine={member.userId == user.userId}
            />
          ))}
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: roomData.roomContent || "" }}
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
            ref={inputRef}
            className="chat-input"
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
