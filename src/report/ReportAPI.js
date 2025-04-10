// src/api/reportApi.js

import axios from "axios";

// 신고 생성 API
export const createReport = async ({
  targetId,
  targetType,
  reportedUserId,
  reason,
}) => {
  try {
    const payload = {
      targetId,
      targetType,
      reportedUserId: reportedUserId || null, // 선택적 필드
      reason,
    };

    const response = await axios.post(
      "http://localhost:8080/reports",
      payload,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "신고 중 오류 발생");
    }
    throw new Error("신고 요청 실패");
  }
};
