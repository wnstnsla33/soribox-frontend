import React, { useState } from "react";
import axios from "axios";

export default function FindIdModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  // 생일 입력받아서 자동 변환
  const formatBirth = (birthInput) => {
    if (birthInput.length === 8) {
      return `${birthInput.slice(0, 4)}-${birthInput.slice(
        4,
        6
      )}-${birthInput.slice(6, 8)}`;
    }
    return birthInput;
  };

  const handleFindId = async () => {
    setResult(null);
    setError(null);
    const formattedBirth = formatBirth(birth);
    if (!email.trim()) {
      setError("이름을 입력하세요");
      return;
    } else if (!birth.trim()) {
      setError("생일을 입력하세요");
      return;
    } else if (birth.length !== 8) {
      setError("형식에맞춰 입력하세요");
      return;
    }
    try {
      const res = await axios.post(
        `${BASE_URL}/find/id`,
        {
          userName: email,
          userBirthDay: formattedBirth,
        },
        {
          withCredentials: true, // 쿠키 전달용
        }
      );
      setResult(res.data.data); // 성공 시 아이디 출력
    } catch (err) {
      setError(err.response?.data || "아이디 찾기 실패");
    }
  };

  return (
    <div className="absolute top-16 right-4 w-72 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">아이디 찾기</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">이름</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="이름 입력"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            생년월일 (8자리)
          </label>
          <input
            type="text"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="예: 20050217"
            maxLength={8}
          />
        </div>

        <button
          onClick={handleFindId}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          아이디 찾기
        </button>

        {result && (
          <p className="mt-4 text-blue-600 font-semibold">아이디: {result}</p>
        )}
        {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
