import axios from "axios";

// 친구 요청 보내기
export const requestFriend = async (userId) => {
  try {
    const res = await axios.post(
      `http://localhost:8080/friends/${userId}`,
      {},
      { withCredentials: true }
    );

    // ✅ 백엔드 응답 구조: { success: true, message: "...", data: null }
    return {
      success: true,
      message: res.data.message,
    };
  } catch (error) {
    console.error("친구 요청 실패:", error);

    // 백엔드 예외 메시지 추출
    const message =
      error.response?.data?.message || "친구 요청에 실패했습니다.";

    return {
      success: false,
      message,
    };
  }
};
