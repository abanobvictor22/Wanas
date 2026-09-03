import "./App.css";
import Register from "./page/register/Register";
import { createBrowserRouter } from "react-router-dom";
import Layout from "./page/layout/Layout";
import { RouterProvider } from "react-router";
import Posts from "./page/posts/Posts";
import Login from "./page/login/Login";
import { AuthContextProvider } from "./componatns/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProtectRoute from "./componatns/protectRoute/ProtectRoute";
import ProtectAuth from "./componatns/protectAuth/ProtectAuth";
import PostDetails from "./page/postDetails/PostDetails";
import UserProfile from "./page/userProfile/UserProfile";

const queryClient = new QueryClient();

const routing = createBrowserRouter([
  {
    path: "register",
    element: (
      <ProtectAuth>
        <Register />
      </ProtectAuth>
    ),
  },
  {
    path: "login",
    element: (
      <ProtectAuth>
        <Login />
      </ProtectAuth>
    ),
  },

  {
    path: "",
    element: (
      <ProtectRoute>
        <Layout />
      </ProtectRoute>
    ),
    children: [
      { index: true, element: <Posts /> },
      { path: "postDetails/:id", element: <PostDetails /> },
      { path: "userProfile", element: <UserProfile /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={routing} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default App;
