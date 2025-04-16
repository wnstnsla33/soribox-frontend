import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";

export default function Profile() {
  const user = useSelector((state) => state.user.userInfo);

  const isSNS =
    user?.userEmail.startsWith("naver ") ||
    user?.userEmail.startsWith("google ") ||
    user?.userEmail.startsWith("kakao ");

  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = () => {
    axios
      .delete("http://localhost:8080/user/delete", {
        data: isSNS ? {} : { pwd: password },
        withCredentials: true,
      })
      .then(() => {
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "/";
      })
      .catch((err) => {
        console.log(err);
        const msg = err.response?.data || "탈퇴 중 오류가 발생했습니다.";
        setErrorMsg(msg);
      });
  };

  if (!user) return <div>유저 정보를 불러오는 중...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      {/* 프로필 이미지 및 닉네임 */}
      <div className="flex items-center gap-6">
        <img
          src={`http://localhost:8080${user.userImg}`}
          alt="유저 프로필 이미지"
          className="w-32 h-32 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {user.userNickName || "닉네임을 지정해주세요"}
          </h2>
        </div>
      </div>

      {/* 프로필 정보 테이블 */}
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

      {/* 수정 및 탈퇴 섹션 */}
      <div className="mt-6 flex flex-col items-end">
        <Link to={"/profileEdit"}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            프로필 수정하기
          </button>
        </Link>

        <button
          onClick={() => setShowModal(true)}
          className="mt-2 text-sm text-red-500 underline hover:text-red-700"
        >
          탈퇴하기
        </button>
      </div>

      {/* 탈퇴 모달 */}
      {showModal && (
        <DeleteConfirmModal
          isSNS={isSNS}
          password={password}
          setPassword={setPassword}
          errorMsg={errorMsg}
          onCancel={() => {
            setShowModal(false);
            setPassword("");
            setErrorMsg("");
          }}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
