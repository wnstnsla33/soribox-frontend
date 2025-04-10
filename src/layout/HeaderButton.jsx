import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import UserModal from "../Myinfo/Myinfo";
import LoginModal from "../Login/LoginModal";

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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex gap-4 justify-end items-center">
      {/* 항상 보이는 Main 버튼 */}
      <Link to="/">
        <button>Main</button>
      </Link>

      {/* 항상 보이는 Menu 버튼 */}
      <div className="relative" ref={menuRef}>
        <button onClick={toggleMenu}>Menu ▼</button>
        {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}
      </div>

      {/* 로그인 안 된 경우에만 Login 버튼 및 모달 */}
      {!userInfo && (
        <div ref={loginRef}>
          <button onClick={toggleLogin}>Login</button>
          {isLoginOpen && (
            <LoginModal
              onClose={toggleLogin}
              findid={() => console.log("아이디 찾기")}
              findpwd={() => console.log("비밀번호 찾기")}
            />
          )}
        </div>
      )}

      {/* 로그인 된 경우에만 Write, Info */}
      {userInfo && (
        <>
          <div className="relative" ref={writeRef}>
            <button onClick={toggleWrite}>Write ▼</button>
            {isWriteOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-50">
                <ul className="py-2">
                  <Link to="/createRoom" onClick={() => setIsWriteOpen(false)}>
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
              className="border border-black text-black px-4 py-1 rounded-full hover:bg-purple-600 hover:text-black transition"
              onClick={toggleInfo}
            >
              Info
            </button>
            {isInfoOpen && (
              <UserModal
                onClose={() => setIsInfoOpen(false)}
                user={userInfo}
                onLogout={handleLogout}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
