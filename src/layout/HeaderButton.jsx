import React from "react";
import LoginModal from "../Login/LoginModal";
import UserModal from "../Myinfo/Myinfo";
import Menu from "./Menu";
import FindIdModal from "../Login/FindIdModal";
import FindPwdModal from "../Login/FindPwdModal";
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
    <div className="relative flex gap-4 justify-end">
      {userInfo ? (
        <button onClick={infoOpen}>내 정보</button>
      ) : (
        <button onClick={toggleLogin}>로그인</button>
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
        <button onClick={toggleMenu}>메뉴 ▼</button>
        {isMenuOpen && <Menu onClose={toggleMenu} />}
      </div>
    </div>
  );
}
