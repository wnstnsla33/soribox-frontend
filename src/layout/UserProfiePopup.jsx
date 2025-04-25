import { useState, useRef, useEffect } from "react";
import MessageModal from "../admin/user/MessageModal";
import { requestFriend } from "./apiFriends";
import UserInfoPopup from "../friends/UserInfoPopup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function UserProfilePopup({
  userImg,
  userNickname,
  userId,
  fromFriends = false,
  fromRoom = false,
  roomId,
  isHost,
  isMine,
}) {
  const [open, setOpen] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const popupRef = useRef();
  const BASE_URL = process.env.REACT_APP_API_URL;
  const BASE_IMG = process.env.REACT_APP_IMG_URL;
  const bannedUser = async (targetUserId) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/chatRoom/banned`,
        {
          roomId: roomId,
          userId: targetUserId,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "강퇴 성공");
    } catch (err) {
      toast.error(err.response?.data?.message || "강퇴 실패");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFriendClick = async () => {
    try {
      const res = await requestFriend(userId);
      toast.success(res.message || "친구 요청 성공");
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "친구 요청 실패");
    }
  };

  return (
    <div className="relative inline-block" ref={popupRef}>
      <img
        src={`${BASE_IMG}${userImg}`}
        alt="프로필"
        className="w-10 h-10 rounded-full object-cover cursor-pointer hover:scale-105 transition"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute z-50 top-8 left-0 w-40 bg-white border rounded-lg shadow-lg text-sm">
          <div className="px-4 py-2 font-semibold border-b">{userNickname}</div>

          {/* 정보 보기 버튼은 항상 표시 */}
          <button
            onClick={() => {
              setShowUserInfo(true);
              setOpen(false);
            }}
            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
          >
            정보 보기
          </button>

          {/* 본인이 아닌 경우에만 나머지 메뉴 표시 */}
          {!isMine && (
            <>
              {!fromFriends && (
                <button
                  onClick={handleFriendClick}
                  className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  친구 추가
                </button>
              )}
              <button
                onClick={() => {
                  setShowMessageModal(true);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                메시지 보내기
              </button>
              {fromRoom && isHost && (
                <button
                  onClick={() => bannedUser(userId)}
                  className="w-full px-4 py-2 hover:bg-red-100 text-left text-red-500"
                >
                  강퇴하기
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showUserInfo && (
        <UserInfoPopup userId={userId} onClose={() => setShowUserInfo(false)} />
      )}
      {showMessageModal && (
        <MessageModal
          toUser={{ userId, userNickName: userNickname }}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
}
