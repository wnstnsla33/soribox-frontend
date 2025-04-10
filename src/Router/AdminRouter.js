// src/Router/AdminRouter.js
import React from "react";
import AdminMain from "../admin/AdminMain";
import AdminHeader from "../admin/AdminHeader";
import AdminUser from "../admin/user/AdminUser";
import AdminPost from "../admin/Post/AdminPost";
import AdminWriteNotice from "../admin/Post/AdminWriteNotice";
import { AdminPostDetail } from "../admin/Post/AdminWriteNotice";
import AdminRoom from "../admin/Room/AdminRoom";
import UserDetailByAdmin from "../admin/user/UserDetailByAdmin";
import RoomDetail from "../admin/Room/RoomDetail";
import AdminReportDetail from "../admin/Report/AdminReportDetail";
const AdminRouter = [
  {
    path: "/admin",
    element: <AdminHeader />, // Header 감싸기
    children: [
      { path: "/admin", element: <AdminMain /> },
      { path: "/admin/users", element: <AdminUser /> },
      { path: "/admin/users/:userId", element: <UserDetailByAdmin /> },
      { path: "/admin/posts", element: <AdminPost /> },
      { path: "/admin/post/write", element: <AdminWriteNotice /> },
      { path: "/admin/post/:postId", element: <AdminPostDetail /> },
      { path: "/admin/rooms", element: <AdminRoom /> },
      { path: "/admin/rooms/:roomId", element: <RoomDetail /> },
      { path: "/admin/report/:reportId", element: <AdminReportDetail /> },
    ],
  },
];

export default AdminRouter;
