import axios from "axios";

export async function getMyInfo() {
  try {
    const response = await axios.get("http://localhost:8080/user", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("정보 가져오기 실패:", error);
    return null;
  }
}
