import React from "react";
import { Link } from "react-router-dom";

export default function UserModal({ user, onLogout, onClose }) {
  return (
    <div className="absolute top-16 right-4 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <div className="p-4">
        {/* 내 정보 + 이미지 */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">내 정보</h2>
          <img
            src={user.userImg}
            alt="유저 프로필"
            className="w-12 h-12 rounded-full object-cover border"
          />
        </div>

        {/* 이름 */}
        <div className="mb-4 text-sm text-gray-700">
          <p>
            <span className="font-medium">이름:</span> {user.userName}
          </p>
        </div>

        {/* 경험치 바 */}
        <div className="mb-4">
          <span className="block text-sm font-medium mb-1">
            레벨 {user.userLevel}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${(user.userExp / 100) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 text-sm text-gray-700">
          <Link to="profile" className="hover:underline" onClick={onClose}>
            내 정보 보기
          </Link>
          <Link to="profileEdit" className="hover:underline" onClick={onClose}>
            정보 수정
          </Link>
        </div>

        <button
          onClick={onLogout}
          className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
