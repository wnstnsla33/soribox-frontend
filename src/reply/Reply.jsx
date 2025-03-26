import axios from "axios";
import { useState } from "react";

export default function Reply({ reply, onDelete, postId }) {
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
  const [isReplying, setIsReplying] = useState(false); // 답글 입력 모드 여부
  const [editedContent, setEditedContent] = useState(reply.content); // 수정할 댓글 내용
  const [newReply, setNewReply] = useState(""); // 답글 내용

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:8080/reply/${reply.id}`, {
          withCredentials: true,
        })
        .then(() => {
          alert("댓글이 삭제되었습니다.");
          onDelete(reply.id); // 댓글 삭제 후 부모 컴포넌트에 알리기
        })
        .catch((err) => console.error("댓글 삭제 실패:", err));
    }
  };

  const handleEditChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleEditSubmit = () => {
    if (!editedContent.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }
    axios
      .put(
        `http://localhost:8080/reply/${reply.id}`,
        { content: editedContent },
        { withCredentials: true }
      )
      .then((res) => {
        alert("댓글이 수정되었습니다.");
        setIsEditing(false); // 수정 모드 종료
      })
      .catch((err) => {
        console.error("댓글 수정 실패:", err);
        alert("댓글 수정 중 오류가 발생했습니다.");
      });
  };

  const handleReplyChange = (e) => {
    setNewReply(e.target.value);
  };

  const handleReplySubmit = () => {
    if (!newReply.trim()) {
      alert("답글을 입력하세요.");
      return;
    }
    axios
      .post(
        `http://localhost:8080/post/${postId}/reply`, // 답글을 해당 댓글에 추가하는 엔드포인트
        { content: newReply },
        { withCredentials: true }
      )
      .then((res) => {
        alert("답글이 작성되었습니다.");
        setIsReplying(false); // 답글 입력 종료
        setNewReply(""); // 입력 필드 초기화
      })
      .catch((err) => {
        console.error("답글 작성 실패:", err);
        alert("답글 작성 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="mb-4 border-b pb-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold">{reply.userNickname}</span>
        <span className="text-sm text-gray-500">{reply.createDate}</span>
      </div>

      {/* 댓글 내용 */}
      {!isEditing ? (
        <p className="text-lg mt-2">{reply.content}</p>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          {/* 수정 입력란 */}
          <textarea
            value={editedContent}
            onChange={handleEditChange}
            className="w-3/4 p-2 border border-gray-300 rounded-md text-sm"
            rows="3"
          />
          <button
            onClick={handleEditSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            수정 완료
          </button>
        </div>
      )}

      {/* 수정 / 삭제 버튼 */}
      <div className="mt-2 text-sm text-gray-600">
        <a
          href="#!"
          className="mr-4"
          onClick={() => setIsReplying((prev) => !prev)} // 답글 입력 필드 토글
        >
          답글
        </a>
        <a
          href="#!"
          className="mr-4"
          onClick={() => setIsEditing((prev) => !prev)} // 수정 모드 토글
        >
          수정
        </a>
        <a href="#!" onClick={handleDelete} className="text-red-500">
          삭제
        </a>
      </div>

      {/* 답글 입력 부분 */}
      {isReplying && (
        <div className="mt-4 flex items-center gap-2">
          {/* 답글 입력란 */}
          <textarea
            value={newReply}
            onChange={handleReplyChange}
            placeholder="답글을 작성하세요..."
            className="w-3/4 p-2 border border-gray-300 rounded-md text-sm"
            rows="3"
          />
          <button
            onClick={handleReplySubmit}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            답글 작성
          </button>
        </div>
      )}
    </div>
  );
}
