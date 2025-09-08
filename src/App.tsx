import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// User Components
import GuestScreen from "./user/UserScreen/GuestScreen";
import GuestQueue from "./user/UserScreen/GuestQueue";

// Admin Components
// import AdminMain from "./admin/screens/AdminMain";
// import AdManager from "./admin/screens/AdManager";
// import MemberList from "./admin/screens/MemberList";
// import QueueList from "./admin/screens/QueueList";
import Dashboard from "./admin/screens/Dashboard";
import Sidebar from "./admin/components/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<div>홈 화면</div>} />
        <Route path="/guest-register" element={<GuestScreen />} />
        <Route path="/guest-queue" element={<GuestQueue />} />

        {/* Admin Routes */}
        <Route path="/sider" element={<Sidebar />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/admin" element={<AdminMain />} />
        <Route path="/admin/ads" element={<AdManager />} />
        <Route path="/admin/members" element={<MemberList />} />
        <Route path="/admin/queue" element={<QueueList />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
