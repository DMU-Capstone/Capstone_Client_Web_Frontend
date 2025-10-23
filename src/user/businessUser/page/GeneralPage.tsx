import React, { useMemo } from "react";
import { LineChart } from "../charts/LineChart";
import { useDashboardAll } from "../hooks/useBiz";

export const GeneralPage: React.FC = () => {
  // TODO: 실제 선택된 매장/기간과 연동
  const params = useMemo(() => ({
    storeId: 1,                  // 선택된 storeId 주입
    dateRange: "2025-10-01~2025-10-07",
  }), []);

  const { generalKpis, generalSeries, loading, err } = useDashboardAll(params);

  // LineChart series 정의: biz.service에서 만든 key와 맞춰야 함
  const seriesDef = [
    { key: "visitors", label: "대기자(추정)", color: "#60a5fa" },
    { key: "queues",   label: "실제 이용",     color: "#e5e7eb" },
    { key: "actual",   label: "이탈 수",       color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-[#41474D] p-4">
        {err && <div className="text-rose-400 text-sm mb-2">{err}</div>}
        <LineChart data={generalSeries} series={seriesDef} />
        {loading && <div className="mt-2 text-sm text-slate-300">로딩 중…</div>}
      </section>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label="총 방문자 수"            value={generalKpis?.totalVisitors}/>
        <Kpi label="총 대기열 수"            value={generalKpis?.totalQueues}/>
        <Kpi label="총 실제 이용자 수"       value={generalKpis?.totalActual}/>
        <Kpi label="이탈율"                   value={generalKpis ? `${(generalKpis.churnRate*100).toFixed(1)} %` : undefined}/>
        <Kpi label="첫 이용까지 걸린 시간(분)" value={generalKpis?.firstUseMinutes?.toFixed?.(1)}/>
        <Kpi label="총 이탈 수"              value={generalKpis?.totalChurn}/>
      </div>
    </div>
  );
};

const Kpi: React.FC<{label:string; value:any}> = ({label, value}) => (
  <div className="rounded-2xl bg-slate-800/60 p-4 text-center">
    <div className="text-slate-300 text-sm">{label}</div>
    <div className="mt-1 text-2xl font-semibold">{value ?? "-"}</div>
  </div>
);