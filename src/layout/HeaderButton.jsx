import React from "react";
import LoginModal from "../Login/LoginModal";
import UserModal from "../Myinfo/Myinfo";
import Menu from "./Menu";
import FindIdModal from "../Login/FindIdModal";
import FindPwdModal from "../Login/FindPwdModal";
import { Link } from "react-router-dom";
export default function HeaderButtons({
  userInfo,
  isLoginOpen,
  isInfoOpen,
  isMenuOpen,
  toggleLogin,
  infoOpen,
  toggleMenu,
  handleLogout,
  IsFindpwdOpen,
  isFindIdOpen,
  findid,
  findpwd,
}) {
  return (
    <div className="relative flex gap-4 justify-end items-center">
      {userInfo && (
        <Link to="/">
          <button>Main</button>
        </Link>
      )}
      {userInfo && (
        <Link to="/createRoom">
          <button>Write</button>
        </Link>
      )}

      {isLoginOpen && (
        <LoginModal onClose={toggleLogin} findid={findid} findpwd={findpwd} />
      )}
      {isInfoOpen && userInfo && (
        <UserModal onClose={infoOpen} user={userInfo} onLogout={handleLogout} />
      )}
      {isFindIdOpen && <FindIdModal onClose={findid} />}
      {IsFindpwdOpen && <FindPwdModal onClose={findpwd} />}

      <div className="relative">
        <button onClick={toggleMenu}>Menu ▼</button>
        {isMenuOpen && <Menu onClose={toggleMenu} />}
      </div>
      {userInfo ? (
        <button
          className="border border-black text-black px-4 py-1 rounded-full hover:bg-purple-600 hover:text-black transition"
          onClick={infoOpen}
        >
          Info
        </button>
      ) : (
        <button onClick={toggleLogin}>Login</button>
      )}
    </div>
  );
}
