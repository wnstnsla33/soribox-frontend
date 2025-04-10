import React, { useRef, useState } from "react";
import axios from "axios";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useNavigate } from "react-router-dom";
export default function WritePost() {
  const titleRef = useRef(null);
  const editorRef = useRef(null);
  const [isSecret, setIsSecret] = useState(false);
  const [secretPassword, setSecretPassword] = useState("");
  const navigate = useNavigate();
  // HTML에서 첫 번째 이미지 src 추출
  const extractFirstImageSrc = (html) => {
    const match = html.match(/<img[^>]+src=["']?([^>"']+)["']?/);
    return match ? match[1] : "http://localhost:8080/uploads/noimg.png";
  };

  // 에디터 내부 이미지 업로드 처리
  const handleImageUpload = async (blob, callback) => {
    const formData = new FormData();
    formData.append("image", blob);
    try {
      const res = await axios.post(
        "http://localhost:8080/post/image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      const fullUrl = "http://localhost:8080" + res.data.data;
      callback(fullUrl, "이미지");
    } catch (err) {
      alert("이미지 업로드 실패:", err.response.data.message);
    }
  };

  const handleSubmit = async () => {
    const contentHTML = editorRef.current.getInstance().getHTML();
    const titleImgSrc = extractFirstImageSrc(contentHTML);

    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    formData.append("content", contentHTML);
    formData.append("titleImg", titleImgSrc);

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
      alert(res.data.message);
      navigate("/post");
    } catch (err) {
      alert(err.response.data.message);
      navigate("/");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-2xl rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-8">게시글 작성</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">제목</label>
        <input
          type="text"
          ref={titleRef}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">내용</label>
        <Editor
          ref={editorRef}
          previewStyle="vertical"
          height="400px"
          initialEditType="wysiwyg"
          useCommandShortcut={true}
          hooks={{
            addImageBlobHook: handleImageUpload,
          }}
        />
      </div>

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
