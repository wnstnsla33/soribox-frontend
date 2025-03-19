// store/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 thunk로 로그인한 내 정보 가져오기
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async () => {
    const response = await axios.get("http://localhost:8080/user", {
      withCredentials: true,
    });
    return response.data;
  }
);

// 로그아웃 처리
export const logout = createAsyncThunk("user/logout", async () => {
  await axios
    .post("http://localhost:8080/user/logout", {}, { withCredentials: true })
    .then((res) => alert(res.data));
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
      .addCase(logout.fulfilled, (state) => {
        state.userInfo = null;
      });
  },
});

export default userSlice.reducer;
