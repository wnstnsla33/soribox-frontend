export default function Menu() {
  return (
    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg">
      <ul className="py-2">
        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">글쓰기</li>
        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
          게시판 글 목록
        </li>
      </ul>
    </div>
  );
}
