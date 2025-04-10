import React, { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function Stomp() {
  const clientRef = useRef(null);
  const roomId = "13074e64-f345-4fe0-ae58-5c610b2b8cbc"; // 💬 테스트용 채팅방 ID
  const userName = "tester"; // 임시 사용자명

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws-stomp");
    const client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {},
      reconnectDelay: 5000,
      onConnect: () => {
        // ✅ 채팅방 구독

        // ✅ 테스트 메시지 전송
        client.publish({
          destination: "/pub/chat/message",
          body: JSON.stringify({
            roomId: roomId,
            sender: userName,
            message: "안녕하세요! 프론트에서 보냈어요 👋",
            type: "TALK",
          }),
        });
      },
      onStompError: (frame) => {},
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current && clientRef.current.connected) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  return (
    <div>
      <h2>🛰️ STOMP WebSocket 연결 테스트</h2>
      <p>roomId: {roomId}</p>
    </div>
  );
}
