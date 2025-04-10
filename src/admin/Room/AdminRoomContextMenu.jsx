export default function AdminRoomContextMenu({
  position,
  roomId,
  roomTitle,
  onDelete,
  onClose,
}) {
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
          alert(`방 정보 보기: ${roomId} (${roomTitle})`);
          onClose();
        }}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        👁 방 정보 보기
      </li>
      <li
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="px-4 py-2 hover:bg-red-100 text-red-500 cursor-pointer"
      >
        🗑 방 삭제하기
      </li>
    </ul>
  );
}
