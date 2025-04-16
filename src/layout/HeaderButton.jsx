import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import UserModal from "../Myinfo/Myinfo";
import LoginModal from "../Login/LoginModal";
import FindIdModal from "../Login/FindIdModal";
import FindPwdModal from "../Login/FindPwdModal";
import FriendRequestPopup from "../friends/FriendRequestPopup";
import FriendListPopup from "../friends/FriendListPopup"; // ✅ 친구 목록 팝업 추가

export default function HeaderButtons({
  userInfo,
  isWriteOpen,
  isMenuOpen,
  isInfoOpen,
  isLoginOpen,
  toggleWrite,
  toggleMenu,
  toggleInfo,
  toggleLogin,
  handleLogout,
  setIsWriteOpen,
  setIsMenuOpen,
  setIsInfoOpen,
  setIsLoginOpen,
}) {
  const writeRef = useRef(null);
  const menuRef = useRef(null);
  const infoRef = useRef(null);
  const loginRef = useRef(null);

  const [showFindId, setShowFindId] = useState(false);
  const [showFindPwd, setShowFindPwd] = useState(false);
  const [showFriendPopup, setShowFriendPopup] = useState(false);
  const [showFriendListPopup, setShowFriendListPopup] = useState(false); // ✅ 친구 목록 상태

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !writeRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target) &&
        !infoRef.current?.contains(e.target) &&
        !loginRef.current?.contains(e.target)
      ) {
        setIsWriteOpen(false);
        setIsMenuOpen(false);
        setIsInfoOpen(false);
        setIsLoginOpen(false);
        setShowFindId(false);
        setShowFindPwd(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openFindId = () => {
    toggleLogin();
    setShowFindId(true);
    setShowFindPwd(false);
  };

  const openFindPwd = () => {
    toggleLogin();
    setShowFindPwd(true);
    setShowFindId(false);
  };

  return (
    <div className="relative flex gap-4 justify-end items-center">
      <Link to="/">
        <button>Main</button>
      </Link>

      <div className="relative" ref={menuRef}>
        <button onClick={toggleMenu}>Menu ▼</button>
        {isMenuOpen && (
          <Menu
            onClose={() => setIsMenuOpen(false)}
            onFriendPopupOpen={() => setShowFriendPopup(true)}
          />
        )}
      </div>

      {!userInfo && (
        <div ref={loginRef} className="relative">
          <button onClick={toggleLogin}>Login</button>

          {(isLoginOpen || showFindId || showFindPwd) && (
            <div className="absolute top-full right-0 z-50">
              {isLoginOpen && (
                <LoginModal
                  onClose={() => {
                    toggleLogin();
                    setShowFindId(false);
                    setShowFindPwd(false);
                  }}
                  findid={() => {
                    setIsLoginOpen(false);
                    setShowFindId(true);
                  }}
                  findpwd={() => {
                    setIsLoginOpen(false);
                    setShowFindPwd(true);
                  }}
                />
              )}
              {showFindId && (
                <FindIdModal
                  onClose={() => {
                    setShowFindId(false);
                    setIsLoginOpen(true);
                  }}
                />
              )}
              {showFindPwd && (
                <FindPwdModal
                  onClose={() => {
                    setShowFindPwd(false);
                    setIsLoginOpen(true);
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}

      {userInfo && (
        <>
          <div className="relative" ref={writeRef}>
            <button onClick={toggleWrite}>Write ▼</button>
            {isWriteOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
                <ul className="py-2">
                  <Link
                    to="/createRoom"
                    onClick={() => {
                      setIsWriteOpen(false);
                    }}
                  >
                    <li className="px-4 py-2 hover:bg-gray-200">방 만들기</li>
                  </Link>
                  <Link to="/post/new" onClick={() => setIsWriteOpen(false)}>
                    <li className="px-4 py-2 hover:bg-gray-200">글쓰기</li>
                  </Link>
                </ul>
              </div>
            )}
          </div>

          <div ref={infoRef}>
            <button
              className="border border-black text-black px-4 py-1 rounded-full hover:bg-purple-600 hover:text-white transition"
              onClick={toggleInfo}
            >
              Info
            </button>
            {isInfoOpen && (
              <UserModal
                onClose={() => setIsInfoOpen(false)}
                user={userInfo}
                onLogout={handleLogout}
                onFriendListOpen={() => setShowFriendListPopup(true)} // ✅ 여기 추가
              />
            )}
          </div>
        </>
      )}

      {showFriendPopup && (
        <FriendRequestPopup onClose={() => setShowFriendPopup(false)} />
      )}
      {showFriendListPopup && (
        <FriendListPopup onClose={() => setShowFriendListPopup(false)} />
      )}
    </div>
  );
}
