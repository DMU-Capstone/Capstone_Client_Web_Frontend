import React, { useMemo } from "react";
import { LineChart } from "../charts/LineChart";
import { useDashboardAll } from "../hooks/useBiz";

export const GeneralPage: React.FC = () => {
  // TODO: 실제 선택된 매장/기간과 연동
  const params = useMemo(
    () => ({
      storeId: 1, // 선택된 storeId 주입
      dateRange: "2025-10-01~2025-10-07",
    }),
    []
  );

  const { generalKpis, generalSeries, loading, err } = useDashboardAll(params);

  // LineChart series 정의: biz.service에서 만든 key와 맞춰야 함
  const seriesDef = [
    { key: "visitors", label: "대기자(추정)", color: "#3B82F6" }, // blue-500
    { key: "queues", label: "실제 이용", color: "#9CA3AF" }, // gray-400
    { key: "actual", label: "이탈 수", color: "#16A34A" }, // green-600
  ];

  return (
    <div className="space-y-6">
      {/* --- 그래프 카드 --- */}
      <section className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
        {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
        <LineChart data={generalSeries} series={seriesDef} />
        {loading && <div className="mt-2 text-sm text-gray-500">로딩 중…</div>}
      </section>

      {/* --- KPI 카드 영역 --- */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label="총 방문자 수" value={generalKpis?.totalVisitors} accent="text-blue-600" />
        <Kpi label="총 대기열 수" value={generalKpis?.totalQueues} accent="text-blue-600" />
        <Kpi label="총 실제 이용자 수" value={generalKpis?.totalActual} accent="text-green-600" />
        <Kpi
          label="이탈율"
          value={generalKpis ? `${(generalKpis.churnRate * 100).toFixed(1)} %` : undefined}
          accent="text-gray-700"
        />
        <Kpi
          label="첫 이용까지 걸린 시간(분)"
          value={generalKpis?.firstUseMinutes?.toFixed?.(1)}
          accent="text-orange-500"
        />
        <Kpi label="총 이탈 수" value={generalKpis?.totalChurn} accent="text-gray-700" />
      </div>
    </div>
  );
};

// --- KPI 카드 컴포넌트 (라이트 테마용) ---
const Kpi: React.FC<{ label: string; value: any; accent?: string }> = ({
  label,
  value,
  accent = "text-blue-600",
}) => (
  <div className="rounded-2xl bg-white p-4 text-center shadow-sm border border-gray-200 hover:shadow-md transition">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className={`mt-1 text-2xl font-semibold ${accent}`}>{value ?? "-"}</div>
  </div>
);