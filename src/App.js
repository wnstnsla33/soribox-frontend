import "./App.css";
import SignUp from "./signup/SignUp";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Header from "./layout/Header";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <Header />
      </div>
    ),
    children: [{ path: "/signup", element: <SignUp /> }],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
