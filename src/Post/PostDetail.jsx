import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserInfo } from "../store/userSlice";
import Reply from "../reply/Reply";
import "react-toastify/dist/ReactToastify.css";
import bookmark from "../img/bookmark.png";
import noBookmark from "../img/noBookmark.png";
import ReportButton from "../report/ReportButton";
import dayjs from "dayjs";
export default function PostDetail() {
  const formatDateTime = (dateString) =>
    dayjs(dateString).format("YYYY-MM-DD HH:mm");

  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  // 🔄 댓글 최신화 함수
  const fetchReplies = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/post/${postId}/reply`,
        { withCredentials: true }
      );
      setReplies(res.data.data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user.userId) {
          try {
            await dispatch(fetchUserInfo()).unwrap();
          } catch {
            // 비회원일 수 있으니 무시
          }
        }

        const res = await axios.get(`http://localhost:8080/post/${postId}`, {
          withCredentials: true,
        });

        if (res.data.data.title === "비밀글") {
          setShowPasswordPopup(true);
        } else {
          setPost(res.data.data);
          fetchReplies();
        }
      } catch (err) {
        alert(err.response.data.message);
        navigate("/");
      }
    };

    fetchData();
  }, [postId, dispatch]);

  const handlePasswordSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/post/secrete/${postId}`,
        { pwd: password },
        { withCredentials: true }
      );
      setPost(res.data.data);
      setShowPasswordPopup(false);
      fetchReplies();
    } catch {
      alert("비밀번호가 틀렸습니다.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:8080/post/${postId}`, {
          withCredentials: true,
        })
        .then(() => {
          alert("삭제되었습니다.");
          navigate("/post");
        })
        .catch(() => alert("삭제 실패"));
    }
  };

  const toggleBookmark = () => {
    axios
      .post(`http://localhost:8080/post/bookmark/${postId}`, null, {
        withCredentials: true,
      })
      .then((res) => {
        setPost((prev) => ({
          ...prev,
          bookmarked: res.data.data.bookmarked,
          bookmarkCount: res.data.data.postBookmarkCount,
        }));
        toast.success(
          res.data.data.bookmarked ? "북마크에 추가됨" : "북마크 해제됨"
        );
      })
      .catch((res) => toast.error(res.response.data.message));
  };

  const handleNewReplySubmit = () => {
    if (!newReply.trim()) return alert("댓글을 입력하세요.");
    axios
      .post(
        `http://localhost:8080/post/${postId}/reply`,
        { content: newReply },
        { withCredentials: true }
      )
      .then(() => {
        setNewReply("");
        fetchReplies();
        toast.success("댓글 작성됨");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "댓글 작성 중 오류 발생");
      });
  };

  if (showPasswordPopup) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
          <h2 className="text-lg font-bold mb-4">비밀번호를 입력하세요</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="비밀번호 입력"
          />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePasswordSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              확인
            </button>
            <button
              onClick={() => navigate("/post")}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return <div>Loading...</div>;

  return (
    <div className="relative min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4">
            <span>북마크 {post.bookmarkCount}</span>
            <img
              src={post.bookmarked ? bookmark : noBookmark}
              alt="북마크"
              onClick={toggleBookmark}
              className="w-10 h-10 cursor-pointer"
            />
            <ToastContainer position="top-center" autoClose={2000} />
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-2">
          작성일: {formatDateTime(post.createDate)}
        </div>

        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <span>작성자: {post.userNickName}</span>
          <span>조회수: {post.viewCount}</span>
        </div>

        <div
          className="text-lg mb-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <div>수정일: {formatDateTime(post.modifiedDate)}</div>
          <ReportButton
            targetId={post.postId.toString()}
            targetType="POST"
            reportedUserId={null}
          />
        </div>
      </div>

      {user?.userId === post.userId && (
        <div className="fixed bottom-10 right-10 flex gap-4">
          <Link to={`/post/edit/${post.postId}`} state={{ post }}>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              수정하기
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            삭제하기
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-4">댓글</h2>
        <div className="flex items-center gap-4 mb-4">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="댓글을 작성하세요..."
            className="w-full h-20 p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleNewReplySubmit}
            className="py-2 px-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            댓글 작성
          </button>
        </div>

        {replies.length > 0 ? (
          replies.map((reply) => (
            <Reply
              key={reply.replyId}
              reply={reply}
              postId={postId}
              onRefresh={fetchReplies}
            />
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
