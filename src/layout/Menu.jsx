import { Link } from "react-router-dom";
export default function Menu({ onClose }) {
  return (
    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
      <ul className="py-2">
        <Link to={"/post"} onClick={onClose}>
          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
            게시판 글 목록
          </li>
        </Link>
        <Link to={"/post/notice"} onClick={onClose}>
          <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
            공지 글 목록
          </li>
        </Link>
      </ul>
    </div>
  );
}
