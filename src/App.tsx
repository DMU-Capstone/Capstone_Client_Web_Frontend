import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// User Components
import GuestScreen from "./user/UserScreen/GuestScreen";
import GuestQueue from "./user/UserScreen/GuestQueue";
import Main from "./user/page/Main";

// Business Chart Components
import BusinessDashboard from "./user/businessUser/page/BusinessDashboard";

// Admin Components
import Dashboard from "./admin/page/Dashboard";
import Login from "./user/page/Login";
import MemberList from "./admin/page/MemberList";
import MainBanner from "./admin/page/MainBanner";
import NoticeList from "./admin/page/NoticeList";
import StoreList from "./admin/page/StoreList";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/guest-register",
      element: <GuestScreen />,
    },
    {
      path: "/guest-queue",
      element: <GuestQueue />,
    },
    {
      path: "/chart",
      element: <BusinessDashboard />,
    },
    {
      path: "/admin/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/admin/members",
      element: <MemberList />,
    },
    {
      path: "/admin/mainbanner",
      element: <MainBanner />,
    },
    {
      path: "/admin/notices",
      element: <NoticeList />,
    },
    {
      path: "/admin/stores/list",
      element: <StoreList />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
