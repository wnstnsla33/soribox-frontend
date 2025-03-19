import React, { useRef, useState } from "react";
import axios from "axios";

export default function WritePost() {
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const [isSecret, setIsSecret] = useState(false);
  const [secretPassword, setSecretPassword] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("content", contentRef.current.value);
    formData.append("titleImg", imageRef.current.files[0]);

    // 비밀글일 경우 secreteKey 추가
    if (isSecret) {
      if (!secretPassword.trim()) {
        alert("비밀글 비밀번호를 입력해주세요");
        return;
      }
      formData.append("secreteKey", secretPassword);
    }

    try {
      const res = await axios.post("http://localhost:8080/post/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("게시글이 등록되었습니다!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("게시글 등록 실패");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-8">게시글 작성</h2>

      {/* 제목 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">제목</label>
        <input
          type="text"
          ref={titleRef}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="제목을 입력하세요"
        />
      </div>

      {/* 대표 이미지 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">대표 이미지</label>
        <input type="file" accept="image/*" ref={imageRef} />
      </div>

      {/* 내용 */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">내용</label>
        <textarea
          rows="8"
          ref={contentRef}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      {/* 비밀글 옵션 */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="secret"
          checked={isSecret}
          onChange={() => setIsSecret(!isSecret)}
          className="mr-2"
        />
        <label htmlFor="secret" className="font-semibold">
          비밀글
        </label>
      </div>

      {/* 비밀번호 입력 */}
      {isSecret && (
        <div className="mb-4">
          <label className="block font-semibold mb-2">비밀번호</label>
          <input
            type="password"
            value={secretPassword}
            onChange={(e) => setSecretPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
            placeholder="비밀글 비밀번호를 입력하세요"
          />
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-[#DED8CB] text-black rounded-lg hover:bg-[#c8c2b5] transition"
        >
          작성하기
        </button>
      </div>
    </div>
  );
}
