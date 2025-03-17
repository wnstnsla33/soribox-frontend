import React, { useRef, useState } from "react";
import axios from "axios";
import ValidEmail from "./ValidEmail";
import { useNavigate } from "react-router-dom";
export default function SignUp() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nicknameRef = useRef(null);
  const realNameRef = useRef(null);
  const birthDateRef = useRef(null);
  const genderRef = useRef(null);
  const [isValid, setIsValid] = useState(false); // 이메일 인증 여부
  const navigate = useNavigate();
  // 유효성 검사 로직
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*()]).{8,}$/;
    return regex.test(password);
  };

  const validateNickname = (nickname) => {
    const regex = /^[a-zA-Z0-9가-힣]{2,15}$/;
    return regex.test(nickname);
  };

  const validateRealName = (realName) => {
    const regex = /^[가-힣]{2,20}$/;
    return regex.test(realName);
  };

  const validateBirthDate = (birthDate) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(birthDate);
  };

  const validateGender = (gender) => {
    return ["male", "female", "other"].includes(gender);
  };

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    nickname: "",
    realName: "",
    birthDate: "",
    gender: "",
  });

  // 실시간 유효성 검사
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "password":
        if (!validatePassword(value))
          error =
            "비밀번호는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.";
        break;
      case "nickname":
        if (!validateNickname(value))
          error = "닉네임은 2자 이상 15자 이하로 입력해주세요.";
        break;
      case "realName":
        if (!validateRealName(value))
          error = "실명은 2자 이상 20자 이하로 입력해주세요.";
        break;
      case "birthDate":
        if (!validateBirthDate(value))
          error = "생년월일은 yyyy-MM-dd 형식으로 입력해주세요.";
        break;
      case "gender":
        if (!validateGender(value))
          error = "성별은 male, female, other 중 하나여야 합니다.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    // 이메일 인증 여부 확인
    if (!isValid) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    // 유효성 검사 오류 확인
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      alert("입력값을 확인해주세요.");
      return;
    }

    // 서버로 데이터 전송
    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      nickname: nicknameRef.current.value,
      realName: realNameRef.current.value,
      birthDate: birthDateRef.current.value,
      gender: genderRef.current.value,
    };

    axios
      .post("http://localhost:8080/signup", userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((response) => {
        alert(response.data);
        navigate("/");
      })

      .catch((error) => alert(error.response.data));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-[#DED8CB] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <form className="space-y-4">
          {/* 이메일 입력 필드 */}
          <ValidEmail isValid={() => setIsValid(true)} ref={emailRef} />

          {/* 비밀번호 입력 필드 */}
          <div>
            <label className="block text-sm font-medium mb-1">비밀번호</label>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="비밀번호를 입력하세요"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          {/* 닉네임 입력 필드 */}
          <div>
            <label className="block text-sm font-medium mb-1">닉네임</label>
            <input
              type="text"
              name="nickname"
              ref={nicknameRef}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="닉네임을 입력하세요"
            />
            {errors.nickname && (
              <p className="text-red-500 text-sm">{errors.nickname}</p>
            )}
          </div>

          {/* 실명 입력 필드 */}
          <div>
            <label className="block text-sm font-medium mb-1">실명</label>
            <input
              type="text"
              name="realName"
              ref={realNameRef}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="실명을 입력하세요"
            />
            {errors.realName && (
              <p className="text-red-500 text-sm">{errors.realName}</p>
            )}
          </div>

          {/* 생년월일 입력 필드 */}
          <div>
            <label className="block text-sm font-medium mb-1">생년월일</label>
            <input
              type="date"
              name="birthDate"
              ref={birthDateRef}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
            {errors.birthDate && (
              <p className="text-red-500 text-sm">{errors.birthDate}</p>
            )}
          </div>

          {/* 성별 선택 필드 */}
          <div>
            <label className="block text-sm font-medium mb-1">성별</label>
            <select
              name="gender"
              ref={genderRef}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="">성별을 선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            className="w-full bg-orange-200 text-white p-2 rounded hover:bg-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-200"
            onClick={handleSubmit}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
