import "./App.css";
import SignUp from "./signup/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./layout/Header";
import Profile from "./Myinfo/Profile";
import ProfileEdit from "./Myinfo/ProfileEdit";
import PostList from "./Post/Post";
import WritePost from "./Post/WritePost";
import PostDetail from "./Post/PostDetail";
import PostEdit from "./Post/PostEdit";
import MyPost from "./Post/filterPost/MyPost";
import Stomp from "./stomp/Stmop";
import CreateRoom from "./room/CreateRoom";
import Rooms from "./room/Rooms";
import ChatRoom from "./room/ChatRoom";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Header />
      </div>
    ),
    children: [
      { path: "/signup", element: <SignUp /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profileEdit", element: <ProfileEdit /> },
      { path: "/post", element: <PostList /> },
      { path: "/post/new", element: <WritePost /> },
      { path: "/post/:postId", element: <PostDetail /> },
      { path: "/post/edit/:postId", element: <PostEdit /> },
      { path: "/post/myPost", element: <MyPost /> },
      { path: "/stomp", element: <Stomp /> },
      { path: "/createRoom", element: <CreateRoom /> },
      { path: "/rooms", element: <Rooms /> },
      { path: "/room/:roomId", element: <ChatRoom /> },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
