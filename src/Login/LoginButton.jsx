import axios from "axios";
import { useState } from "react";

export default function LoginButton({ email, password, onclose }) {
  const [error, setError] = useState("");

  const login = () => {
    if (!email || email.trim() === "") {
      setError("이메일을 입력하세요.");
      return;
    }
    if (!password || password.trim() === "") {
      setError("비밀번호를 입력하세요.");
      return;
    }

    setError(""); // 에러 메시지 초기화
    console.log(email + "adfsdf" + password);
    axios
      .post(
        "http://localhost:8080/login",
        { email: email, password: password }, // ✅ 'password'로 수정
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          console.log("로그인 성공!");
          onclose();
          window.location.href = "/";
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log("서버 응답 오류:", error.response);
          setError(error.response.data.error || "로그인 실패");
        } else {
          console.log("요청 오류:", error.message);
          setError("네트워크 오류 발생");
        }
      });
  };

  return (
    <>
      <button
        className="w-full bg-orange-200 text-white p-2 rounded hover:bg-orange-300"
        onClick={login}
      >
        로그인
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </>
  );
}
