import React, { useState } from "react";
import { Link } from "react-router-dom";
import SnsLoginButton from "./SnsLoginButton";
import LoginButton from "./LoginButton";

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="absolute top-16 right-4 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">로그인</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="이메일을 입력하세요"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
        </form>

        {/* ✅ email과 password 값을 props로 전달 */}
        <LoginButton email={email} password={password} onclose={onClose} />

        <SnsLoginButton />

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          닫기
        </button>
      </div>
      <div className="flex justify-around p-2 text-sm text-gray-600">
        <Link to="/signup" className="hover:underline" onClick={onClose}>
          회원가입
        </Link>
        <Link to="/find-id" className="hover:underline">
          아이디 찾기
        </Link>
        <Link to="/find-password" className="hover:underline">
          비밀번호 찾기
        </Link>
      </div>
    </div>
  );
}
