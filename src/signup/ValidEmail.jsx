import { useState, useRef } from "react";
import axios from "axios";

export default function ValidEmail({ isValid, ref }) {
  const [sendCode, setSendCode] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const emailRef = ref;
  const codeRef = useRef(null);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(emailRef.current.value));
  };

  const sendEmail = () => {
    console.log("메일보냄");
    if (!isEmailValid) return;
    axios
      .get(`${BASE_URL}/signup/confirm`, {
        params: { email: emailRef.current.value },
        withCredentials: true,
      })
      .then((res) => {
        alert(res.data.message);
        setSendCode(true); // ✅ 요거 추가해야 인증번호 필드 나옴!
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  const codeValid = () => {
    axios
      .post(
        `${BASE_URL}/signup/confirm`,
        { email: emailRef.current.value, authcode: codeRef.current.value },
        { withCredentials: true }
      )
      .then((res) => {
        setIsVerified(true);
        alert("인증이 완료됐습니다.");
        isValid(); // 부모에 인증 완료 전달
      })
      .catch((error) => {
        console.error("인증 코드 확인 실패:", error);
      });
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">이메일</label>
      <div className="flex space-x-2">
        <input
          type="email"
          className="flex-1 p-2 border border-gray-300 rounded"
          placeholder="이메일을 입력하세요"
          onChange={validateEmail}
          ref={emailRef}
          disabled={isVerified}
        />
        <button
          type="button"
          onClick={sendEmail}
          disabled={!isEmailValid || isVerified}
          className={`px-3 py-2 rounded text-white ${
            isEmailValid && !isVerified
              ? "bg-orange-200 hover:bg-orange-300"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          인증번호 전송
        </button>
      </div>

      {sendCode && !isVerified && (
        <div className="mt-2">
          <label className="block text-sm font-medium mb-1">인증번호</label>
          <div className="flex space-x-2">
            <input
              type="text"
              ref={codeRef}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="인증번호 입력"
            />
            <button
              type="button"
              onClick={codeValid}
              className="bg-orange-200 text-white px-3 py-2 rounded hover:bg-orange-300"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
