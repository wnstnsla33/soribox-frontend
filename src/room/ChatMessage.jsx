import React from "react";
import "./ChatRoom.css";

export default function ChatMessage({ msg, isMine }) {
  if (msg.type === "ENTER" || msg.type === "QUIT") {
    return <div className="system-message">{msg.message}</div>;
  }

  return (
    <div className={`chat-message-wrapper ${isMine ? "my" : "other"}`}>
      <img
        src={msg.profileImageUrl || "/default-profile.png"}
        className="chat-profile-image"
      />
      <div className="chat-message-content">
        <div className="chat-sender-name">{msg.senderName}</div>
        <div className={`chat-message ${isMine ? "my" : "other"}`}>
          {msg.message}
        </div>
      </div>
    </div>
  );
}
