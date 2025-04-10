import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "react-toastify/dist/ReactToastify.css";

export default function PostEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  const [title, setTitle] = useState(post?.title || "");
  const editorRef = useRef(null);

  // ✅ 이미지 업로드 처리
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

  // ✅ 수정 저장
  const handleSave = () => {
    const contentHTML = editorRef.current.getInstance().getHTML();
    axios
      .put(
        `http://localhost:8080/post/${post.postId}`,
        { title, content: contentHTML },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("게시글이 수정되었습니다!");
        setTimeout(() => {
          navigate(`/post/${post.postId}`);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        toast.error("수정 실패!");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">게시글 수정</h1>

        <div className="mb-4">
          <label className="block text-lg mb-2">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 border rounded-lg"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg mb-2">내용</label>
          <Editor
            ref={editorRef}
            previewStyle="vertical"
            height="400px"
            initialEditType="wysiwyg"
            useCommandShortcut={true}
            initialValue={post?.content || ""}
            hooks={{ addImageBlobHook: handleImageUpload }}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            저장하기
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500"
          >
            취소하기
          </button>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}
