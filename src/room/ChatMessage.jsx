import React from "react";
import "./ChatRoom.css";
import ChatProfileMenu from "./ChatProfileMenu";
export default function ChatMessage({ chat, isMine }) {
  if (chat.type === "ENTER" || chat.type === "QUIT" || chat.type === "BANNED") {
    return <div className="system-message">{chat.message}</div>;
  }

  return (
    <div className={`chat-message-wrapper ${isMine ? "my" : "other"}`}>
      {/* ✅ 분리된 프로필 메뉴 */}
      <ChatProfileMenu
        userImg={chat.userImg}
        senderName={chat.senderName}
        userId={chat.userId}
        chatId={chat.chatId}
      />

      <div className="chat-message-content">
        <div className="chat-sender-name">{chat.senderName}</div>
        <div className={`chat-message ${isMine ? "my" : "other"}`}>
          {chat.message}
        </div>
      </div>
    </div>
  );
}
