// store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ access 토큰 재발급 함수
const refreshAccessToken = async () => {
  console.log("🟡 refreshAccessToken() 호출됨");
  try {
    const BASE_URL = process.env.REACT_APP_API_URL;

    const res = await axios.get(`${BASE_URL}/auth/getToken`, {
      withCredentials: true,
    });
    console.log("🟢 access 재발급 성공:", res.data);
    return true;
  } catch (err) {
    console.log("🔴 access 재발급 실패:", err.response?.status);
    return false;
  }
};

// ✅ 비동기 thunk로 로그인한 내 정보 가져오기 (access 만료 대응 포함)
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const BASE_URL = process.env.REACT_APP_API_URL;
      const res = await axios.get(`${BASE_URL}/user`, {
        withCredentials: true,
      });
      console.log("로그인 정보");
      console.log(res);
      return res.data.data;
    } catch (err) {
      const status = err.response?.status;

      console.log("🔴 fetchUserInfo 에러 상태코드:", status);

      // access 토큰 만료인 경우 → refresh로 재발급 시도
      if (status === 401) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          try {
            // 재발급 성공했으면 다시 유저 정보 요청
            const BASE_URL = process.env.REACT_APP_API_URL;
            const retryRes = await axios.get(`${BASE_URL}/user`, {
              withCredentials: true,
            });
            return retryRes.data;
          } catch (retryErr) {
            console.log("🔴 재요청 실패:", retryErr.response?.status);
            return rejectWithValue(retryErr.response?.status);
          }
        } else {
          console.log("🔴 refresh 토큰도 만료됨. 로그인 필요.");
          // window.location.href = "/"; // or dispatch(logout())
          return rejectWithValue("refresh expired");
        }
      }
      return rejectWithValue(status);
    }
  }
);

// ✅ 로그아웃 처리
export const logout = createAsyncThunk("user/logout", async () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  await axios
    .post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true })
    .then((res) => {
      alert(res.data.message);
      fetchUserInfo();
    });
  return null;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        console.warn("❌ 유저 정보 요청 실패:", action.payload);
        state.userInfo = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export default userSlice.reducer;
