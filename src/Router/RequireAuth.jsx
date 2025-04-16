// components/auth/RequireAuth.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserInfo } from "../store/userSlice";
export default function RequireAuth({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await dispatch(fetchUserInfo()).unwrap();
      } catch (err) {
        if (err === 403) {
          alert("로그인이 필요합니다.");
          navigate("/");
        }
      }
    };

    if (!user) checkAuth();
  }, [user, dispatch, navigate]);

  if (!user) return <div className="text-center mt-20">로그인 확인 중...</div>;
  return children;
}
