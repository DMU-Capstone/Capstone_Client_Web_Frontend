// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Dashboard from "./Dashboard";
// import MemberListScreen from "./MemberList";
// import QueueList from "./QueueList";
// import AdManager from "./AdManager";

const AdminMain = () => {
  // const [selectedMenu, setSelectedMenu] = useState("회원관리");

  // const handleMenuSelect = (menu: string) => {
  //   setSelectedMenu(menu);
  // };

  // const renderContent = () => {
  //   switch (selectedMenu) {
  //     case "회원관리":
  //       return <MemberListScreen />;
  //     case "대기열내역":
  //       return <QueueList />;
  //     case "이벤트배너등록":
  //       return <AdManager />;
  //     case "실시간모니터링":
  //       return <Dashboard />;
  //     case "설정":
  //       return (
  //         <div className="p-8">
  //           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  //             <h2 className="text-2xl font-bold mb-4 text-gray-800">설정</h2>
  //             <p className="text-gray-600">설정 페이지는 준비 중입니다.</p>
  //           </div>
  //         </div>
  //       );
  //     default:
  //       return <MemberListScreen />;
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Sidebar selectedMenu={selectedMenu} onSelectMenu={handleMenuSelect} /> */}
      {/* <div className="ml-64 min-h-screen">{renderContent()}</div> */}
    </div>
  );
};

export default AdminMain;
