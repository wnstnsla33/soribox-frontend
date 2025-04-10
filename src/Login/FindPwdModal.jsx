import React, { useState } from "react";
import axios from "axios";

export default function FindPwdModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFindPwd = async () => {
    setResult(null);
    setError(null);

    // 유효성 검사
    if (!email.trim()) {
      setError("이메일을 입력하세요");
      return;
    } else if (!name.trim()) {
      setError("이름을 입력하세요");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/find/pwd",
        {
          userEmail: email,
          userName: name,
        },
        {
          withCredentials: true, // 쿠키 전달용
        }
      );
      setResult(res.data.data); // 성공 시 결과 출력
    } catch (err) {
      setError(err.response?.data || "비밀번호 찾기 실패");
    }
  };

  return (
    <div className="absolute top-16 right-4 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">비밀번호 찾기</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="이메일 입력"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="이름 입력"
          />
        </div>

        <button
          onClick={handleFindPwd}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          비밀번호 재설정하기
        </button>

        {result && (
          <p className="mt-4 text-blue-600 font-semibold">비밀번호: {result}</p>
        )}
        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          취소
        </button>
      </div>
    </div>
  );
}
