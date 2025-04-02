import React, { useRef } from "react";
import Rooms from "../room/rooms/Rooms";
import bgImg from "../img/bgimg.png";
import MainPost from "./MainPost";
export default function MainPage() {
  const roomsRef = useRef(null); // ✅ ref 생성

  const scrollToRooms = () => {
    roomsRef.current?.scrollIntoView({ behavior: "smooth" }); // ✅ 스무스 스크롤
  };

  return (
    <div className="relative w-full bg-[#fefae0]">
      <div className="max-w-[1600px] mx-auto relative">
        {/* 이미지 */}
        <img src={bgImg} alt="Hero" className="w-full object-contain" />

        {/* 텍스트 */}
        <div className="absolute inset-0 flex items-center justify-start px-16 text-left">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              함께하는 모임, <br /> 새로운 사람들과의 연결
            </h2>
            <p className="text-gray-800 mb-8 text-lg">
              다양한 관심사와 취미를 가진 사람들과 만나보세요. <br />
              언제 어디서나 즐겁게!
            </p>
            {/* ✅ 스크롤 버튼 */}
            <button
              onClick={scrollToRooms}
              className="bg-purple-600 text-white px-8 py-3 rounded-full text-lg hover:bg-purple-700 transition"
            >
              지금 시작하기
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Rooms 컴포넌트에 ref 전달 */}
      <div ref={roomsRef} className="max-w-[1600px] mx-auto px-16 py-16">
        <Rooms />
      </div>
      <div>
        <MainPost />
      </div>
    </div>
  );
}
