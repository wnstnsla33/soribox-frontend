import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, logout } from "../store/userSlice";
import HeaderButtons from "./HeaderButton";

export default function Header() {
  const location = useLocation();
  const isMainPage = location.pathname === "/";

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
      <header
        className={`${
          isMainPage ? "absolute top-0 left-0" : "relative"
        } w-full z-20`}
      >
        <div className="max-w-[1600px] mx-auto px-10 py-6 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <button onClick={() => (window.location.href = "/")}>
              <h1
                className={`text-2xl font-bold ${
                  isMainPage ? "text-white" : "text-black"
                }`}
              >
                SoriBox
              </h1>
            </button>
          </div>
          <div className="flex items-center gap-4">
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
            />
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
}
