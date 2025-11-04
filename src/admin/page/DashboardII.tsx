import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { TopBar, type PageKey, type StoreOption } from "../components/DashboardHeader";
import { GeneralPage } from "./GeneralPage";
import { PeakPage } from "./PeakPage";
import { InsightPage } from "./InsightPage";
import { API_BASE_URL } from "../../utils/api";

const BusinessDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStoreId = Number(searchParams.get("storeId") || "") || undefined;

  const [page, setPage] = useState<PageKey>("general");
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [storeId, setStoreId] = useState<number | undefined>(initialStoreId);
  const [selectedMenu, setSelectedMenu] = useState<string>("대시보드");

  // ✅ /stores 호출해서 {id, title} 확보 (드롭다운 표시용)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/stores`, {
          headers: { Accept: "application/json" },
        });
        const json = await res.json(); // [{ id, imgUrl, title }]
        const options: StoreOption[] = (Array.isArray(json) ? json : []).map((s: any) => ({
          id: s.id,
          title: s.title ?? `매장 #${s.id}`,
        }));
        setStores(options);
        if (!storeId && options.length > 0) setStoreId(options[0].id);
      } catch (e) {
        console.error("/stores 로딩 실패", e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL 동기화 (?storeId=)
  useEffect(() => {
    const sp = new URLSearchParams(searchParams);
    if (storeId) sp.set("storeId", String(storeId));
    else sp.delete("storeId");
    setSearchParams(sp, { replace: true });
  }, [storeId]);

  const dateRange = useMemo(() => "2025-10-01~2025-10-07", []);

  return (
    <div className="min-h-screen bg-[#EDEFF2]">
      <Header />
      <div className="pt-16 flex">
        <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
        <div className="flex-1 min-w-0">
          <TopBar
            page={page}
            onNavigate={setPage}
            onDownload={() => window.print()}
            selectedStoreId={storeId ?? null}
            onChangeStoreId={(id) => setStoreId(id)}
            hosts={stores} // ← 제목(title) 포함 옵션 전달
          />

          <main className="max-w-[1200px] mx-auto p-4">
            {!storeId ? (
              <div className="text-gray-500">호스트(매장)를 선택해 주세요.</div>
            ) : page === "general" ? (
              <GeneralPage storeId={storeId} dateRange={dateRange} />
            ) : page === "peak" ? (
              <PeakPage storeId={storeId} dateRange={dateRange} />
            ) : (
              <InsightPage storeId={storeId} dateRange={dateRange} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;