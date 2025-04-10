import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function useChatSocket({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const socket = new SockJS(`http://localhost:8080/ws-stomp`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        // 메시지 구독
        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const payload = JSON.parse(message.body);
          setMessages((prev) => [...prev, payload]);
        });

        // 입장 메시지 전송
        client.publish({
          destination: "/pub/chat/enter",
          body: JSON.stringify({
            type: "ENTER",
            roomId,
            senderName: user.userName,
            userImg: user.userImg || user.profileImagePath, // ✅ 여기 추가
            message: `${user.userName} 님이 입장하셨습니다.`,
          }),
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [roomId, user]);

  const leaveRoom = () => {
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: "/pub/chat/delete",
      body: JSON.stringify({
        type: "QUIT",
        roomId,
        senderName: user.userName,
        userImg: user.userImg || user.profileImagePath, // ✅ 여기도 추가
        message: `${user.userName} 님이 방을 떠났습니다.`,
      }),
    });
  };

  const sendMessage = (message) => {
    if (!message.trim() || !clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: "/pub/chat/message",
      body: JSON.stringify({
        type: "TALK",
        roomId,
        senderName: user.userName,
        userImg: user.userImg || user.profileImagePath, // ✅ 메시지에도 포함
        message,
      }),
    });
  };

  return { messages, sendMessage, leaveRoom, setMessages };
}
