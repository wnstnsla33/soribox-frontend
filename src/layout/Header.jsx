import React, { useState, useEffect } from "react";
import LoginModal from "../Login/LoginModal";
import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import { getMyInfo } from "./myInfo";
import UserModal from "../Myinfo/Myinfo";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [info, setInfo] = useState(null);

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsMenuOpen(false);
    setIsInfoOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLoginOpen(false);
    setIsInfoOpen(false);
  };

  const infoOpen = () => {
    setIsInfoOpen(!isInfoOpen);
    setIsLoginOpen(false);
    setIsMenuOpen(false);
  };

  const fetchInfo = async () => {
    const userInfo = await getMyInfo();
    setInfo(userInfo);
    console.log(info?.userName);
  };

  const logout = async () => {
    await fetch("/logout", { method: "POST", credentials: "include" });
    setInfo(null);
    window.location.href = "/";
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  return (
    <>
      <header>
        <div className="flex justify-between items-center h-16 bg-[#DED8CB] w-screen px-4">
          <div>
            <button>홈으로</button>
          </div>
          <div className="relative flex gap-4 justify-end">
            {info ? (
              <button onClick={infoOpen}>내 정보</button>
            ) : (
              <button onClick={toggleLogin}>로그인</button>
            )}
            {isLoginOpen && <LoginModal onClose={toggleLogin} />}
            {isInfoOpen && (
              <UserModal onClose={infoOpen} user={info} onLogout={logout} />
            )}
            <div className="relative">
              <button onClick={toggleMenu}>메뉴 ▼</button>
              {isMenuOpen && <Menu />}
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
