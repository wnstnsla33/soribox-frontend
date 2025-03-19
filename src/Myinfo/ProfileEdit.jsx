// src/pages/ProfileEdit.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../store/userSlice";
import ProfileEditForm from "./ProfileEditForm";
export default function ProfileEdit() {
  const nav = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  // 새로고침 시 유저 정보 가져오기
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserInfo());
    }
  }, [dispatch, user]);

  const handleUpdate = (userData, isSNSUser) => {
    if (!isSNSUser && !userData.userPassword.trim()) {
      alert("현재 비밀번호를 입력하세요.");
      return;
    }

    axios
      .post("http://localhost:8080/user/edit", userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(fetchUserInfo(res.data));
        alert("프로필이 수정되었습니다.");
        nav("/profile");
      })
      .catch((err) => {
        console.error(err);
        alert("프로필 수정 실패");
      });
  };

  if (!user) return <div>Loading...</div>;

  return <ProfileEditForm user={user} onUpdate={handleUpdate} />;
}
