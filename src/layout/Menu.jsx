import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
export default function Menu({ onClose, onFriendPopupOpen }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [friendRequestCount, setFriendRequestCount] = useState(0);
  const user = useSelector((state) => state.user.userInfo);
  const BASE_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    if (!user) return;
    const fetchMessageCount = axios.get(`${BASE_URL}/messages/unreadMsg`, {
      withCredentials: true,
    });
    const fetchFriendRequestCount = axios.get(
      `${BASE_URL}/friends/request/count`,
      { withCredentials: true }
    );

    Promise.all([fetchMessageCount, fetchFriendRequestCount])
      .then(([msgRes, friendRes]) => {
        setUnreadCount(msgRes.data.data);
        setFriendRequestCount(friendRes.data.data);
      })
      .catch((err) => console.error("카운트 불러오기 실패", err));
  }, [user]);

  const handleFriendClick = () => {
    onClose(); // 메뉴 닫기
    onFriendPopupOpen(); // 부모가 상태 관리
  };

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
        {user && (
          <>
            <Link to={"/myMessage"} onClick={onClose}>
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center">
                <span>메시지</span>
                {unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </li>
            </Link>

            <li
              onClick={handleFriendClick}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
            >
              <span>친구 요청</span>
              {friendRequestCount > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {friendRequestCount}
                </span>
              )}
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
