import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// User Components
import GuestScreen from "./user/UserScreen/GuestScreen";
import GuestQueue from "./user/UserScreen/GuestQueue";
import Main from "./user/page/Main";

// Admin Components
import Dashboard from "./admin/page/Dashboard";
import Login from "./user/page/Login";
import MemberList from "./admin/page/MemberList";
import MainBanner from "./admin/page/MainBanner";
import NoticeList from "./admin/page/NoticeList";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest-register" element={<GuestScreen />} />
        <Route path="/guest-queue" element={<GuestQueue />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/members" element={<MemberList />} />
        <Route path="/admin/mainbanner" element={<MainBanner />} />
        <Route path="/admin/notices" element={<NoticeList />} />
      </Routes>
    </Router>
  );
}

export default App;
