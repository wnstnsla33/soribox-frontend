import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import ReportButton from "../report/ReportButton";
import UserProfilePopup from "../layout/UserProfiePopup";
export default function Reply({ reply, postId, isChild = false, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [editedContent, setEditedContent] = useState(reply.content);
  const [newReply, setNewReply] = useState("");
  const BASE_URL = process.env.REACT_APP_API_URL;
  const user = useSelector((state) => state.user.userInfo);
  const isAuthorized = user?.userId === reply.userId;

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`${BASE_URL}/post/${postId}/${reply.replyId}`, {
          withCredentials: true,
        })
        .then(() => {
          alert("댓글이 삭제되었습니다.");
          onRefresh?.();
        })
        .catch((err) => alert(err.response.data.message));
    }
  };

  const handleEditSubmit = () => {
    if (!editedContent.trim()) return alert("댓글 내용을 입력하세요.");
    axios
      .put(
        `${BASE_URL}/post/${reply.replyId}/reply`,
        { content: editedContent },
        { withCredentials: true }
      )
      .then(() => {
        alert("댓글이 수정되었습니다.");
        setIsEditing(false);
        onRefresh?.();
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  const handleReplySubmit = () => {
    if (!newReply.trim()) return alert("답글을 입력하세요.");
    axios
      .post(
        `${BASE_URL}/post/${postId}/reply`,
        { content: newReply, parentReplyId: reply.replyId },
        { withCredentials: true }
      )
      .then(() => {
        alert("답글이 작성되었습니다.");
        setIsReplying(false);
        setNewReply("");
        onRefresh?.();
      })
      .catch((err) => {
        console.error("답글 작성 실패:", err);
        alert("답글 작성 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="mb-6 pb-3 text-sm">
      {/* 👤 프로필 이미지 + 닉네임 + 버튼들 */}
      <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
        {/* 왼쪽: 이미지 + 닉네임 */}
        <div className="flex items-center gap-2">
          <UserProfilePopup
            userImg={reply.userImg}
            userNickname={reply.userNickname}
            userId={reply.userId}
          />
          <span className="font-semibold text-black">{reply.userNickname}</span>
        </div>

        {/* 오른쪽: 날짜 + 버튼들 */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400">
            {new Date(reply.createDate).toLocaleDateString("ko-KR")}
          </span>

          {!isChild && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="hover:underline"
            >
              답글
            </button>
          )}

          {isAuthorized && (
            <>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="hover:underline"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:underline"
              >
                삭제
              </button>
            </>
          )}

          <ReportButton
            targetId={reply.replyId}
            targetType="REPLY"
            reportedUserId={reply.userId || null}
          />
        </div>
      </div>

      {/* ✏️ 댓글 내용 or 수정 */}
      {!isEditing ? (
        <p className="text-gray-800 whitespace-pre-wrap">{reply.content}</p>
      ) : (
        <div className="mt-1 flex items-start gap-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            rows="3"
          />
          <button
            onClick={handleEditSubmit}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
          >
            완료
          </button>
        </div>
      )}

      {/* 🧵 답글 작성 */}
      {!isChild && isReplying && (
        <div className="mt-2 flex items-start gap-2">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="답글을 작성하세요..."
            className="w-full p-2 border border-gray-300 rounded-md text-sm"
            rows="3"
          />
          <button
            onClick={handleReplySubmit}
            className="px-3 py-1 bg-green-500 text-white rounded-md text-sm"
          >
            작성
          </button>
        </div>
      )}

      {/* 👁️ 답글 보기 버튼 */}
      {!isChild && reply.replys?.length > 0 && (
        <button
          onClick={() => setShowReplies((prev) => !prev)}
          className="mt-2 text-blue-500 text-xs"
        >
          {showReplies ? "답글 숨기기" : `답글 보기 (${reply.replys.length})`}
        </button>
      )}

      {/* 💬 대댓글 렌더링 */}
      {showReplies && reply.replys?.length > 0 && (
        <div className="ml-4 mt-3 border-l pl-4 border-gray-300">
          {reply.replys.map((child) => (
            <Reply
              key={child.replyId}
              reply={child}
              postId={postId}
              isChild={true}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
