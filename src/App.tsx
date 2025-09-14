import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// User Components
import GuestScreen from "./user/UserScreen/GuestScreen";
import GuestQueue from "./user/UserScreen/GuestQueue";
import Main from "./user/page/Main";

// Admin Components
// import AdminMain from "./admin/screens/AdminMain";
// import AdManager from "./admin/screens/AdManager";
// import MemberList from "./admin/screens/MemberList";
// import QueueList from "./admin/screens/QueueList";
import Dashboard from "./admin/page/Dashboard";
import Login from "./user/page/Login";

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

        {/* <Route path="/admin" element={<AdminMain />} />
        <Route path="/admin/ads" element={<AdManager />} />
        <Route path="/admin/members" element={<MemberList />} />
        <Route path="/admin/queue" element={<QueueList />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
