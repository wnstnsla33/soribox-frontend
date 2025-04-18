import axios from "axios";

export async function getMyInfo() {
  try {
    const BASE_URL = process.env.REACT_APP_API_URL;
    const response = await axios.get(`${BASE_URL}/user`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("정보 가져오기 실패:", error);
    return null;
  }
}
