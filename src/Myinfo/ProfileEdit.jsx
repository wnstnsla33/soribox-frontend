// src/pages/ProfileEdit.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../store/userSlice";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, user]);

  const handleUpdate = async (userData, isSNSUser) => {
    if (!isSNSUser && !userData.get("userPassword")?.trim()) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8080/user/edit",
        userData,
        {
          withCredentials: true,
        }
      );
      dispatch(fetchUserInfo(res.data.data));
      alert("프로필이 성공적으로 수정되었습니다.");
      navigate("/profile");
    } catch (err) {
      console.error("프로필 수정 실패:", err);
      alert(err.response.data.message);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg">로딩 중...</div>
      </div>
    );
  }

  // 이미지 기본 경로 세팅
  const updatedUser = {
    ...user,
    userImg: `http://localhost:8080${user.userImg}`,
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">프로필 수정</h2>
      <ProfileEditForm user={updatedUser} onUpdate={handleUpdate} />
    </div>
  );
}
