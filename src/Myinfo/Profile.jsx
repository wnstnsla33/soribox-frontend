import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
export default function Profile() {
  const user = useSelector((state) => state.user.userInfo); // redux에서 user 가져오기

  if (!user) return <div>유저 정보를 불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex items-center gap-6">
        <img
          src={user.userImg}
          alt="유저 프로필 이미지"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {user.userNickName || "닉네임을 지정해주세요"}
          </h2>
        </div>
      </div>

      <div className="mt-8">
        <table className="w-full text-left border-t border-gray-200">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <th className="py-2 font-medium w-32">실명</th>
              <td>{user.userName}</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">나이</th>
              <td>{user.userAge}세</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">등급</th>
              <td>{user.userGrade}</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">생일</th>
              <td>{user.userBirthDay}</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">가입일</th>
              <td>{user.userCreateDate}</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">성별</th>
              <td>{user.userSex}</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">자기소개</th>
              <td>{user.userInfo || "자기소개를 적어주세요~"}</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">경험치</th>
              <td>{user.userExp}</td>
            </tr>
            <tr>
              <th className="py-2 font-medium">레벨</th>
              <td>{user.userLevel}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <Link to={"/profileEdit"}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            프로필 수정하기
          </button>
        </Link>
      </div>
    </div>
  );
}
