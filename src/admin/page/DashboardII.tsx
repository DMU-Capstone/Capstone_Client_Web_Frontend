import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
//import { TopBar, type PageKey } from "../components/Header"; // 그대로 유지
import { InsightPage } from "./InsightPage";
import { PeakPage } from "./PeakPage";
import { GeneralPage } from "./GeneralPage";
import { TopBar, type PageKey } from "../components/DashboardHeader";

const BusinessDashboard: React.FC = () => {
  const [page, setPage] = useState<PageKey>("general");

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* 상단 고정 헤더 */}
      <Header />

      {/* 사이드바 */}
      <div className="fixed top-16 left-0 h-full w-72 bg-white shadow-lg z-40">
        <Sidebar selectedMenu={page} onSelectMenu={(menu) => setPage(menu as PageKey)} />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 ml-72 pt-20 p-6">
        {/* 상단 네비게이션 (TopBar 대체용 or 내부 탭 네비게이터) */}
        <div className="mb-6">
          <TopBar page={page} onNavigate={setPage} />
        </div>

        {/* 실제 콘텐츠 영역 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {page === "general" && <GeneralPage />}
          {page === "insight" && <InsightPage />}
          {page === "peak" && <PeakPage />}
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;