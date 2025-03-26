import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import bookmark from "../img/bookmark.png";
import noBookmark from "../img/noBookmark.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Reply from "../reply/Reply";
import { fetchUserInfo } from "../store/userSlice";
export default function PostDetail() {
  const location = useLocation();
  const { postId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);

  const passedPost = location.state?.post;
  const [post, setPost] = useState(passedPost);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const dispatch = useDispatch();
  console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          await dispatch(fetchUserInfo()).unwrap(); // ✅ user 정보를 반드시 먼저 가져오기
        }

        // 그 후 게시글 가져오기
        if (!post) {
          const res = await axios.get(`http://localhost:8080/post/${postId}`, {
            withCredentials: true,
          });

          if (res.data.title === "비밀글") {
            setShowPasswordPopup(true);
          } else {
            setPost(res.data);
          }
        }

        // 댓글 가져오기 (비밀글 제외)
        if (post?.title !== "비밀글") {
          const replyRes = await axios.get(
            `http://localhost:8080/post/${postId}/reply`,
            {
              withCredentials: true,
            }
          );
          setReplies(replyRes.data);
        }
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    };

    fetchData();
  }, [postId, dispatch]);

  // 비밀번호 검증 요청
  const handlePasswordSubmit = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/post/secrete/${postId}`,
        { pwd: password },
        { withCredentials: true }
      );
      setPost(res.data);
      setShowPasswordPopup(false);
    } catch (err) {
      console.error("비밀번호 검증 실패:", err);
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
        .catch((err) => {
          console.error(err);
          alert("삭제 실패");
        });
    }
  };
  const toggleBookmark = () => {
    axios
      .post(`http://localhost:8080/post/bookmark/${postId}`, null, {
        withCredentials: true,
      })
      .then((res) => {
        const isBookmarked = res.data.bookmarked;
        const postBookmarkCount = res.data.postBookmarkCount;
        setPost((prevPost) => ({
          ...prevPost,
          bookmarked: isBookmarked,
          bookmarkCount: postBookmarkCount,
        }));

        // ✅ 토스트 메시지
        if (isBookmarked) {
          toast.success("북마크에 추가되었습니다!");
        } else {
          toast.info("북마크에서 해제되었습니다.");
        }
      })
      .catch((err) => {
        console.log(err.response?.data || err);
        toast.error("북마크 처리 중 오류가 발생했습니다.");
      });
  };
  const handleNewReplySubmit = () => {
    if (!newReply.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }
    axios
      .post(
        `http://localhost:8080/post/${postId}/reply`,
        { content: newReply },
        { withCredentials: true }
      )
      .then((res) => {
        setReplies((prevReplies) => [res.data, ...prevReplies]);
        setNewReply(""); // 댓글 작성 후 입력 필드 비우기
        toast.success("댓글이 작성되었습니다.");
      })
      .catch((err) => {
        console.error("댓글 작성 실패:", err);
        toast.error("댓글 작성 중 오류가 발생했습니다.");
      });
  };
  // 비밀번호 입력 팝업

  if (showPasswordPopup) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
          <h2 className="text-lg font-bold mb-4">비밀번호를 입력하세요</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호 입력"
          />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePasswordSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              확인
            </button>
            <button
              onClick={() => navigate("/post")}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
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
      {/* 게시글 내용 */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* 상단 제목, 북마크 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-700">
              북마크 {post.bookmarkCount}
            </span>
            <img
              onClick={toggleBookmark}
              src={post.bookmarked ? bookmark : noBookmark}
              alt="북마크"
              className="w-10 h-10 cursor-pointer hover:scale-110 transition-transform"
            />
            <ToastContainer position="top-center" autoClose={2000} />
          </div>
        </div>

        {/* 작성일 */}
        <div className="text-sm text-gray-500 mb-2">
          작성일: {post.createDate}
        </div>

        {/* 작성자 / 조회수 */}
        <div className="flex justify-between text-gray-500 text-sm mb-4">
          <span>작성자: {post.userName}</span>
          <span>조회수: {post.viewCount}</span>
        </div>

        {/* 대표 이미지 */}
        <img
          src={`http://localhost:8080${post.titleImg}`}
          alt={post.title}
          className="w-full h-96 object-cover rounded-lg mb-6"
        />

        {/* 내용 */}
        <div className="text-lg mb-8 whitespace-pre-line">{post.content}</div>

        {/* 수정일 */}
        <div className="text-sm text-gray-500">수정일: {post.modifiedDate}</div>
      </div>

      {/* 수정 / 삭제 버튼 - 우측 하단 고정 */}
      {user?.userName === post.userName && (
        <div className="fixed bottom-10 right-10 flex gap-4">
          <Link to={`/post/edit/${post.postId}`} state={{ post }}>
            <button className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">
              수정하기
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
          >
            삭제하기
          </button>
        </div>
      )}

      {/* 댓글 입력 */}
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

        {/* 댓글 목록 */}
        {replies.length > 0 ? (
          replies.map((reply) => (
            <Reply key={reply.id} reply={reply} postId={postId} />
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
