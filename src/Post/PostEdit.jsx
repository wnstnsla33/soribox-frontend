import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "react-toastify/dist/ReactToastify.css";

export default function PostEdit() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ 게시글 상세 정보 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/post/${postId}`, {
          withCredentials: true,
        });
        const post = res.data.data;
        setTitle(post.title);
        setContent(post.content);
      } catch (err) {
        console.error("게시글 로딩 실패:", err);
        toast.error("게시글을 불러오지 못했습니다.");
        navigate("/post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId, navigate]);

  // ✅ 이미지 업로드
  const handleImageUpload = async (blob, callback) => {
    const formData = new FormData();
    formData.append("image", blob);
    try {
      const res = await axios.post(`${BASE_URL}/post/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      const fullUrl = `${BASE_URL}` + res.data.data;
      callback(fullUrl, "이미지");
    } catch (err) {
      toast.error("이미지 업로드 실패: " + (err.response?.data?.message || ""));
    }
  };

  // ✅ 수정 저장
  const handleSave = () => {
    const contentHTML = editorRef.current.getInstance().getHTML();
    axios
      .put(
        `${BASE_URL}/post/${postId}`,
        { title, content: contentHTML },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("게시글이 수정되었습니다!");
        setTimeout(() => {
          navigate(`/post/${postId}`);
        }, 1500);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "수정 실패");
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg">게시글 불러오는 중...</div>
      </div>
    );
  }

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
            initialValue={content}
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
    </div>
  );
}
