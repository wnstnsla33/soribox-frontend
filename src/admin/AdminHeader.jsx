// src/layout/AdminHeader.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import NotFound from "../ErrorPage/NotFound";
export default function AdminHeader() {
  const [authorized, setAuthorized] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin`, {
          withCredentials: true,
        });
        setAuthorized(res.status === 200);
      } catch (err) {
        console.error("Admin 권한 확인 실패:", err);
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  if (authorized === null) return null;
  if (!authorized) return <NotFound isUnauthorized={true} />;
  return (
    <div>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          backgroundColor: "#1f2937",
          color: "white",
        }}
      >
        <h2 style={{ margin: 0 }}>관리자 페이지</h2>
        <nav style={{ display: "flex", gap: "1.5rem" }}>
          <a href="/admin" style={{ color: "white", textDecoration: "none" }}>
            홈
          </a>
          <a
            href="/admin/users"
            style={{ color: "white", textDecoration: "none" }}
          >
            👥 유저 목록
          </a>
          <a
            href="/admin/posts"
            style={{ color: "white", textDecoration: "none" }}
          >
            📝 게시판
          </a>
          <a
            href="/admin/rooms"
            style={{ color: "white", textDecoration: "none" }}
          >
            🏠 룸
          </a>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
