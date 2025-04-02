import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../store/userSlice";
import useChatSocket from "./useChatSocket";
import ChatMessage from "./ChatMessage";
import axios from "axios";
import "./ChatRoom.css";

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);

  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const chatBoxRef = useRef(null);

  const { messages, sendMessage, leaveRoom, setMessages } = useChatSocket({
    roomId,
    user,
  });

  // 스크롤 항상 아래로
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 유저 정보 로딩
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  // 방 정보 조회 + 방 입장
  useEffect(() => {
    axios
      .get(`http://localhost:8080/chatRoom/${roomId}`, {
        withCredentials: true,
      })
      .then((res) => setRoomInfo(res.data))
      .catch((err) => {
        alert(err);
        navigate("/rooms");
      });
  }, [roomId]);

  // ✅ 이전 채팅 내역 불러오기
  useEffect(() => {
    axios
      .get(`http://localhost:8080/chatRoom/${roomId}/messages`, {
        withCredentials: true,
      })
      .then((res) => {
        setMessages(res.data); // 초기 메시지 설정
      })
      .catch((err) => {
        console.error("이전 메시지 불러오기 실패", err);
      });
  }, [roomId]);

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  const handleExit = () => {
    navigate("/");
  };

  const handleLeaveRoom = async () => {
    if (roomInfo.hostName === user.userName) {
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
      alert(res.data);
      leaveRoom();
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("방 나가기 실패!");
    }
  };

  return (
    <div className="chat-room-wrapper styled-theme">
      <div className="room-info-panel scrollable-info">
        <h3>{roomInfo?.roomTitle}</h3>
        <p>
          <strong>방장:</strong> {roomInfo?.hostName}
        </p>
        <p>
          <strong>참여 인원:</strong> {roomInfo?.curPaticipants} /{" "}
          {roomInfo?.maxParticipants}
        </p>

        <p>
          <strong>유형:</strong> {roomInfo?.roomType}
        </p>
        <div
          className="room-description scrollable-info"
          dangerouslySetInnerHTML={{ __html: roomInfo?.roomContent || "" }}
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
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              msg={msg}
              isMine={msg.senderName === user?.userName}
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
