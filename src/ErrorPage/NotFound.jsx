// src/pages/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import bgImg from "../img/bgimg.png";
import "./NotFound.css"; // 스타일 분리

export default function NotFound({ isUnauthorized = false }) {
  const navigate = useNavigate();

  return (
    <div
      className="notfound-container"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="notfound-content">
        <h1>
          {isUnauthorized
            ? "⛔ 접근 권한이 없습니다"
            : "🚫 404 - 페이지를 찾을 수 없습니다"}
        </h1>
        <p>
          {isUnauthorized
            ? "이 페이지에 접근할 수 있는 권한이 없습니다."
            : "요청하신 주소가 존재하지 않아요."}
        </p>
        <button onClick={() => navigate("/")}>홈으로 가기</button>
      </div>
    </div>
  );
}
