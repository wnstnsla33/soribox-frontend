// src/components/ChatProfileMenu.jsx

import React, { useState, useRef, useEffect } from "react";
import ReportModal from "../report/ReportModal";
import UserInfoPopup from "../friends/UserInfoPopup";
export default function ChatProfileMenu({
  userImg,
  senderName,
  userId,
  chatId,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false); // ✅ 유저정보 팝업 상태
  const menuRef = useRef();
  const BASE_IMG = process.env.REACT_APP_IMG_URL;
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleInfo = () => {
    setShowUserInfo(true); // ✅ 팝업 열기
    setMenuOpen(false);
  };

  const handleReport = () => {
    setReportOpen(true);
    setMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <img
        src={`${BASE_IMG}${userImg}`}
        className="chat-profile-image cursor-pointer"
        onClick={handleProfileClick}
        alt="profile"
      />

      {menuOpen && (
        <div className="absolute top-10 left-1 bg-white border rounded-lg shadow-md text-sm z-50 w-24 text-center py-1">
          <button
            onClick={handleInfo}
            className="block w-full py-2 text-black hover:bg-gray-100"
          >
            정보 보기
          </button>
          <button
            onClick={handleReport}
            className="block w-full py-2 text-red-500 hover:bg-gray-100"
          >
            신고하기
          </button>
        </div>
      )}

      {/* ✅ 신고 모달 */}
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        targetId={chatId}
        targetType="CHAT"
        reportedUserId={userId}
      />

      {/* ✅ 유저 정보 팝업 */}
      {showUserInfo && (
        <UserInfoPopup userId={userId} onClose={() => setShowUserInfo(false)} />
      )}
    </div>
  );
}
