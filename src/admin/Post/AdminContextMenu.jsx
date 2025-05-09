import axios from "axios";

export default function AdminContextMenu({
  position,
  onClose,
  postId,
  postTitle,
  onView,
  onDeleteSuccess,
}) {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const handleDelete = async () => {
    const confirmed = window.confirm(`'${postTitle}' 게시글을 삭제할까요?`);
    if (!confirmed) return;

    try {
      console.log(postId);
      const res = await axios.delete(`${BASE_URL}/admin/post/${postId}`, {
        withCredentials: true,
      });
      alert(res.data.message); // 서버 응답 메시지
      onDeleteSuccess(); // 부모 컴포넌트에서 목록 다시 불러오게
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <ul
      className="absolute bg-white border rounded shadow-lg z-50 w-40"
      style={{
        top: position.y,
        left: position.x,
        position: "fixed",
      }}
    >
      <li
        onClick={() => {
          onView();
          onClose();
        }}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        👁 게시물 보기
      </li>
      <li
        onClick={() => {
          handleDelete();
          onClose();
        }}
        className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
      >
        🗑 삭제하기
      </li>
    </ul>
  );
}
