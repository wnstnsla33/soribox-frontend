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
const UserRouter = [
  {
    path: "/",
    element: <Header />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profileEdit", element: <ProfileEdit /> },
      { path: "/post", element: <Post /> },
      { path: "/post/notice", element: <NoticePost /> },
      { path: "/post/new", element: <WritePost /> },
      { path: "/post/:postId", element: <PostDetail /> },
      { path: "/post/edit/:postId", element: <PostEdit /> },
      { path: "/post/myPost", element: <MyPost /> },
      { path: "/stomp", element: <Stomp /> },
      { path: "/createRoom", element: <CreateRoom /> },
      { path: "/room/:roomId", element: <ChatRoom /> },
      { path: "/myRooms", element: <MyRooms /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export default UserRouter;
