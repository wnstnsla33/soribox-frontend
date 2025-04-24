import Header from "../layout/Header";
import MainPage from "../layout/MainPage";
import SignUp from "../signup/SignUp";
import Profile from "../Myinfo/Profile";
import ProfileEdit from "../Myinfo/ProfileEdit";
import Post from "../Post/Post";
import WritePost from "../Post/WritePost";
import PostDetail from "../Post/PostDetail";
import PostEdit from "../Post/PostEdit";
import MyPost from "../Post/filterPost/MyPost";
import Stomp from "../stomp/Stmop";
import CreateRoom from "../room/CreateRoom";
import ChatRoom from "../room/ChatRoom";
import MyRooms from "../room/MyRooms/MyRooms";
import NotFound from "../ErrorPage/NotFound";
import NoticePost from "../Post/NoticePost";
import MyMessageList from "../message/MyMessageList";
import { MessageDetail } from "../message/MessageDetail";
import RequireAuth from "./RequireAuth";
import RoomEdit from "../room/RoomEdit";
const UserRouter = [
  {
    path: "/",
    element: <Header />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/signup", element: <SignUp /> },
      {
        path: "/profile",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
      {
        path: "/profileEdit",
        element: (
          <RequireAuth>
            <ProfileEdit />
          </RequireAuth>
        ),
      },

      { path: "/post", element: <Post /> },
      { path: "/post/notice", element: <NoticePost /> },

      {
        path: "/post/new",
        element: (
          <RequireAuth>
            <WritePost />
          </RequireAuth>
        ),
      },
      { path: "/post/:postId", element: <PostDetail /> },
      {
        path: "/post/edit/:postId",
        element: (
          <RequireAuth>
            <PostEdit />
          </RequireAuth>
        ),
      },
      {
        path: "/post/myPost",
        element: (
          <RequireAuth>
            <MyPost />
          </RequireAuth>
        ),
      },
      { path: "/stomp", element: <Stomp /> },
      {
        path: "/createRoom",
        element: (
          <RequireAuth>
            <CreateRoom />
          </RequireAuth>
        ),
      },
      {
        path: "/room/:roomId",
        element: (
          <RequireAuth>
            <ChatRoom />
          </RequireAuth>
        ),
      },
      {
        path: "/room/edit/:roomId",
        element: (
          <RequireAuth>
            <RoomEdit />
          </RequireAuth>
        ),
      },
      {
        path: "/myRooms",
        element: (
          <RequireAuth>
            <MyRooms />
          </RequireAuth>
        ),
      },
      {
        path: "/myMessage",
        element: (
          <RequireAuth>
            <MyMessageList />
          </RequireAuth>
        ),
      },
      {
        path: "/messages/:messageId",
        element: (
          <RequireAuth>
            <MessageDetail />
          </RequireAuth>
        ),
      },

      { path: "*", element: <NotFound /> },
    ],
  },
];

export default UserRouter;
