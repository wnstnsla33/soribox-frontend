import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
export default function useChatSocket({ roomId, user, onUserEnter }) {
  const [messages, setMessages] = useState([]);
  const clientRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      return;
    }

    const socket = new SockJS(`http://localhost:8080/ws-stomp`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/sub/chat/room/${roomId}`, (message) => {
          const payload = JSON.parse(message.body);
          console.log(payload.type + "타입" + payload.userId + "유저 아이디");
          if (payload.type === "BANNED" && payload.userId === user.userId) {
            alert("강퇴당했습니다."); // 유저가 '확인' 누를 때까지 멈춤
            client.deactivate(); // 소켓 연결 종료
            navigate("/"); // 그리고 이동
            return;
          }
          if (payload.type === "ENTER") {
            setMessages((prev) => [...prev, payload]);
            onUserEnter({
              userId: payload.userId,
              userNickName: payload.senderName,
              userImg: payload.userImg,
            });
            return;
          }
          setMessages((prev) => [...prev, payload]);
        });

        // client.publish({
        //   destination: "/pub/chat/enter",
        //   body: JSON.stringify({
        //     type: "ENTER",
        //     roomId,
        //     senderName: user.userName,
        //     userImg: user.userImg || user.profileImagePath,
        //     message: `${user.userName} 님이 입장하셨습니다.`,
        //   }),
        // });
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
        userImg: user.userImg || user.profileImagePath,
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
        userImg: user.userImg || user.profileImagePath,
        message,
      }),
    });
  };

  return { messages, sendMessage, leaveRoom, setMessages };
}
