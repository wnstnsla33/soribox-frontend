// src/App.js
import "./App.css";
// 혹시 Tailwind 쓰면
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminRouter from "./Router/AdminRouter";
import UserRouter from "./Router/UserRouter";
const router = createBrowserRouter([
  ...UserRouter, // 일반 사용자용
  ...AdminRouter, // 관리자 전용
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
