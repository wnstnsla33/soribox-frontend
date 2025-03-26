import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, logout } from "../store/userSlice";
import HeaderButtons from "./HeaderButton";
import logoImage from "../img/myplace.png";
export default function Header() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isfindIdOpen, setIsFindidOpen] = useState(false);
  const [isfindpwdOpen, setIsFindpwdOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const toggleLogin = () => {
    setIsLoginOpen(!isLoginOpen);
    setIsMenuOpen(false);
    setIsInfoOpen(false);
    setIsFindidOpen(false);
    setIsFindpwdOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsLoginOpen(false);
    setIsInfoOpen(false);
    setIsFindidOpen(false);
    setIsFindpwdOpen(false);
  };

  const infoOpen = () => {
    setIsInfoOpen(!isInfoOpen);
    setIsLoginOpen(false);
    setIsMenuOpen(false);
    setIsFindidOpen(false);
    setIsFindpwdOpen(false);
  };
  const findId = () => {
    setIsInfoOpen(false);
    setIsLoginOpen(false);
    setIsMenuOpen(false);
    setIsFindidOpen(!isfindIdOpen);
    setIsFindpwdOpen(false);
  };
  const findPwd = () => {
    setIsInfoOpen(false);
    setIsLoginOpen(false);
    setIsMenuOpen(false);
    setIsFindidOpen(false);
    setIsFindpwdOpen(!isfindpwdOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      window.location.replace("/");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  return (
    <>
      <header>
        <div className="flex justify-between items-center h-16 bg-[#FFF4EA] w-screen px-4">
          <button onClick={() => (window.location.href = "/")}>
            <img src={logoImage} alt="로고" className="h-12" />
          </button>
          <HeaderButtons
            userInfo={userInfo}
            isLoginOpen={isLoginOpen}
            isInfoOpen={isInfoOpen}
            isMenuOpen={isMenuOpen}
            isFindIdOpen={isfindIdOpen}
            IsFindpwdOpen={isfindpwdOpen}
            toggleLogin={toggleLogin}
            infoOpen={infoOpen}
            toggleMenu={toggleMenu}
            handleLogout={handleLogout}
            findid={findId}
            findpwd={findPwd}
            onWriteClick={writeClick}
          />
        </div>
      </header>
      <Outlet />
    </>
  );
}
