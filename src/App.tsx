import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

// User Components
import GuestScreen from "./user/UserScreen/GuestQueue";
import GuestQueue from "./user/UserScreen/GuestQueue";
import Main from "./user/page/Main";

// Business Chart Components
import BusinessDashboard from "./user/businessUser/page/BusinessDashboard";
import QueueCreate from "./user/businessUser/page/QueueCreatePage";

// Admin Components
import Dashboard from "./admin/page/Dashboard";
import Login from "./user/page/Login";
import MemberList from "./admin/page/MemberList";
import MainBanner from "./admin/page/MainBanner";
import NoticeList from "./admin/page/NoticeList";
import StoreList from "./admin/page/StoreList";
import Landing from "./user/businessUser/page/LandingPage";
import GuestQPage from "./user/UserScreen/GuestScreen";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest-queue" element={<GuestScreen />} />
        <Route path="/guest-register" element={<GuestQPage />} />

        {/* Business Routes */}
        <Route path="/chart" element={<BusinessDashboard />} />
        <Route path="/login" element={<div>로그인 페이지 연결</div>} />
        <Route path="/queue-create" element={<QueueCreate />} />

  return <RouterProvider router={router} />;
}

export default App;
