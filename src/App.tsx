import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// User Components
import GuestScreen from "./user/UserScreen/GuestQueue";
import GuestQueue from "./user/UserScreen/GuestQueue";
import Main from "./user/page/Main";
import MyPage from "./user/businessUser/page/MyPage";

// Business Chart Components
import BusinessDashboard from "./admin/page/DashboardII";
import QueueCreate from "./user/businessUser/page/QueueCreatePage";
import BusinessPlanPage from "./user/businessUser/page/BusinessPlan";
import AboutPage from "./user/businessUser/page/AboutPage";
import SignupPage from "./user/businessUser/page/SignupPage";
import HostDetailPage from "./user/businessUser/page/HostDetailPage";

// Admin Components
import Dashboard from "./admin/page/Dashboard";
import Login from "./user/page/Login";
import MemberList from "./admin/page/MemberList";
import MainBanner from "./admin/page/MainBanner";
import NoticeList from "./admin/page/NoticeList";
import StoreList from "./admin/page/StoreList";
import Landing from "./user/businessUser/page/LandingPage";
import GuestQPage from "./user/UserScreen/GuestScreen";
import AdminHostsPage from "./admin/page/QueueSessionPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest-queue" element={<GuestScreen />} />
        <Route path="/guest-register" element={<GuestQPage />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* Business Routes */}
        <Route path="/chart" element={<BusinessDashboard />} />
        <Route path="/login" element={<div>로그인 페이지 연결</div>} />
        <Route path="/queue/register" element={<QueueCreate />} />
        <Route path="/business-plan" element={<BusinessPlanPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/stores/:id" element={<HostDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<BusinessDashboard />} />
        <Route path="/admin/members" element={<MemberList />} />
        <Route path="/admin/mainbanner" element={<MainBanner />} />
        <Route path="/admin/notices" element={<NoticeList />} />
        <Route path="/admin/stores/list" element={<StoreList />} />
        <Route path="/admin/queue/active" element={<AdminHostsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
