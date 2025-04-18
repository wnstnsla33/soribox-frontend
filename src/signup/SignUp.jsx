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
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [isValid, setIsValid] = useState(false);
  const [location, setLocation] = useState({ sido: "", sigungu: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();

  const rules = {
    password: {
      regex: /^(?=.*[A-Za-z])(?=.*\d|.*[!@#$%^&*()]).{8,}$/,
      message:
        "비밀번호는 최소 8자 이상이며, 영문 + 숫자/특수문자 조합이어야 합니다.",
    },
    nickname: {
      regex: /^[a-zA-Z0-9가-힣]{2,15}$/,
      message: "닉네임은 2자 이상 15자 이하로 입력해주세요.",
    },
    realName: {
      regex: /^[가-힣]{2,20}$/,
      message: "실명은 한글 2~20자여야 합니다.",
    },
    birthDate: {
      regex: /^\d{4}-\d{2}-\d{2}$/,
      message: "생년월일은 yyyy-MM-dd 형식입니다.",
    },
    gender: {
      validate: (val) => ["male", "female", "other"].includes(val),
      message: "성별은 male, female, other 중 하나여야 합니다.",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (rules[name]) {
      const rule = rules[name];
      const isValid = rule.regex
        ? rule.regex.test(value)
        : rule.validate(value);
      if (!isValid) error = rule.message;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    setGlobalError("");
  };

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setLocation({
          sido: data.sido || "",
          sigungu: data.sigungu || "",
        });
      },
    }).open();
  };

  const calculateAge = (birthStr) => {
    const birthDate = new Date(birthStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = () => {
    setGlobalError("");

    if (!isValid) {
      setGlobalError("이메일 인증을 완료해주세요.");
      return;
    }

    const hasErrors = Object.values(errors).some((e) => e);
    if (hasErrors) {
      setGlobalError("입력값을 확인해주세요.");
      return;
    }

    if (!location.sido || !location.sigungu) {
      setGlobalError("주소를 선택해주세요.");
      return;
    }

    const age = calculateAge(birthDateRef.current.value);
    if (age < 15) {
      setGlobalError("15세 이상만 가입할 수 있습니다.");
      return;
    }

    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      nickname: nicknameRef.current.value,
      realName: realNameRef.current.value,
      birthDate: birthDateRef.current.value,
      gender: genderRef.current.value,
      sido: location.sido,
      sigungu: location.sigungu,
      age: age,
    };

    axios
      .post(`${BASE_URL}/signup`, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        alert(res.data.message);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        const msg = err?.response?.data?.message || "회원가입 중 오류 발생";
        setGlobalError(msg);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-[#DED8CB] p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
        <form className="space-y-4">
          {globalError && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
              {globalError}
            </div>
          )}

          <ValidEmail isValid={() => setIsValid(true)} ref={emailRef} />

          {[
            {
              label: "비밀번호",
              type: "password",
              name: "password",
              ref: passwordRef,
            },
            {
              label: "닉네임",
              type: "text",
              name: "nickname",
              ref: nicknameRef,
            },
            { label: "실명", type: "text", name: "realName", ref: realNameRef },
            {
              label: "생년월일",
              type: "date",
              name: "birthDate",
              ref: birthDateRef,
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                ref={field.ref}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1">성별</label>
            <select
              name="gender"
              ref={genderRef}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">성별 선택</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
              <option value="other">기타</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">거주 지역</label>
            <div className="flex space-x-2">
              <input
                type="text"
                readOnly
                value={`${location.sido} ${location.sigungu}`}
                placeholder="주소를 검색하세요"
                className="flex-1 p-2 border border-gray-300 rounded bg-gray-100"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                주소 검색
              </button>
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-orange-200 text-white p-2 rounded hover:bg-orange-300"
            onClick={handleSubmit}
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
}
