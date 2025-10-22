import { useState } from "react";
import Sidebar from "../admin/components/Sidebar";
import { Outlet } from "react-router-dom";
import Header from "../admin/components/Header";
export const AdminLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  return (
    <>
      <Header />
      <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
      <main>
        <Outlet />
      </main>
    </>
  );
};
