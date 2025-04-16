import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, logout } from "../store/userSlice";
import HeaderButtons from "./HeaderButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header() {
  const location = useLocation();
  const isMainPage = location.pathname === "/";
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleWrite = () => {
    setIsWriteOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsInfoOpen(false);
    setIsLoginOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsWriteOpen(false);
    setIsInfoOpen(false);
    setIsLoginOpen(false);
  };

  const toggleInfo = () => {
    setIsInfoOpen((prev) => !prev);
    setIsWriteOpen(false);
    setIsMenuOpen(false);
    setIsLoginOpen(false);
  };

  const toggleLogin = () => {
    setIsLoginOpen((prev) => !prev);
    setIsWriteOpen(false);
    setIsMenuOpen(false);
    setIsInfoOpen(false);
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
    if (!userInfo) {
      dispatch(fetchUserInfo());
      console.log("페칭");
    }
  }, []);

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
              isWriteOpen={isWriteOpen}
              isMenuOpen={isMenuOpen}
              isInfoOpen={isInfoOpen}
              isLoginOpen={isLoginOpen}
              toggleWrite={toggleWrite}
              toggleMenu={toggleMenu}
              toggleInfo={toggleInfo}
              toggleLogin={toggleLogin}
              handleLogout={handleLogout}
              setIsWriteOpen={setIsWriteOpen}
              setIsMenuOpen={setIsMenuOpen}
              setIsInfoOpen={setIsInfoOpen}
              setIsLoginOpen={setIsLoginOpen}
            />
          </div>
        </div>
      </header>

      {/* ✅ 전역에서 toast를 쓸 수 있도록 여기에만 한 번 넣는다 */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ✅ 하위 페이지들 */}
      <Outlet />
    </>
  );
}
