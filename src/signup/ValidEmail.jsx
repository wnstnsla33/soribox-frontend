import { useState, useRef } from "react";
import axios from "axios";

export default function ValidEmail({ isValid, ref }) {
  const [sendCode, setSendCode] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // 이메일 인증 완료 여부
  const emailRef = ref;
  const codeRef = useRef(null);

  // 이메일 유효성 검사
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(emailRef.current.value));
  };

  // 이메일 전송
  const sendEmail = () => {
    if (!isEmailValid) return;
    axios
      .get("http://localhost:8080/signup/confirm", {
        params: { email: emailRef.current.value },
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.responseMessage);
        if (res.data.success) {
          setSendCode(true);
          alert("이메일을 확인하세요");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  // 인증 코드 확인
  const codeValid = () => {
    axios
      .post(
        "http://localhost:8080/signup/confirm",
        { email: emailRef.current.value, authcode: codeRef.current.value },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.data.responseMessage);
        if (res.data.success) {
          setIsVerified(true); // 이메일 인증 완료
          isValid(); // 부모 컴포넌트에 인증 완료 상태 전달
        }
      })
      .catch((error) => {
        console.error("인증 코드 확인 실패:", error);
      });
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-1">이메일</label>
        <div className="flex space-x-2">
          <input
            type="email"
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="이메일을 입력하세요"
            onChange={validateEmail}
            ref={emailRef}
            disabled={isVerified} // 인증 완료 시 비활성화
          />
          <button
            type="button"
            onClick={sendEmail}
            disabled={!isEmailValid || isVerified} // 인증 완료 시 버튼 비활성화
            className={`px-3 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-orange-200 ${
              isEmailValid && !isVerified
                ? "bg-orange-200 hover:bg-orange-300"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            인증번호 전송
          </button>
        </div>
      </div>

      {/* 인증번호 입력 필드 & 확인 버튼 */}
      {sendCode &&
        !isVerified && ( // 인증 완료 전에만 표시
          <div>
            <label className="block text-sm font-medium mb-1">인증번호</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="인증번호 입력"
                ref={codeRef}
              />
              <button
                type="button"
                onClick={codeValid}
                className="bg-orange-200 text-white px-3 py-2 rounded hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                확인
              </button>
            </div>
          </div>
        )}
    </>
  );
}
