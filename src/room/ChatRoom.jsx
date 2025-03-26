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

  const handleLeaveRoom = async () => {
    if (roomInfo.hostName == user.userName) {
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

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

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

  const { messages, sendMessage, leaveRoom } = useChatSocket({ roomId, user });

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="chat-room-wrapper styled-theme">
      <div className="room-info-panel">
        <h3>{roomInfo?.roomTitle}</h3>
        <p>
          <strong>방장:</strong> {roomInfo?.hostName}
        </p>
        <p>
          <strong>참여 인원:</strong> {roomInfo?.curPaticipants} /{" "}
          {roomInfo?.maxParticipants}
        </p>
        <p>
          <strong>설명:</strong> {roomInfo?.roomContent}
        </p>
        <p>
          <strong>유형:</strong> {roomInfo?.roomType}
        </p>
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
