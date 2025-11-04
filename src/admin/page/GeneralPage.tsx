import { useMemo } from "react";
import { useDashboardAll } from "../hooks/useBiz";
import { LineChart } from "../charts/LineChart";

type Props = {
  storeId: number;
  dateRange: string;
};

export const GeneralPage: React.FC<Props> = ({ storeId, dateRange }) => {
  const params = useMemo(() => ({ storeId, dateRange }), [storeId, dateRange]);

  const { generalKpis, generalSeries, loading, err } = useDashboardAll(params);

  const seriesDef = [
    { key: "visitors", label: "대기자(추정)", color: "#3b82f6" },
    { key: "queues",   label: "실제 이용",     color: "#9ca3af" },
    { key: "actual",   label: "이탈 수",       color: "#22c55e" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-4 shadow-md border border-gray-200">
        {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
        <LineChart data={generalSeries} series={seriesDef} />
        {loading && <div className="mt-2 text-sm text-gray-500">로딩 중…</div>}
      </section>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Kpi label="총 방문자 수" value={generalKpis?.totalVisitors} />
        <Kpi label="총 대기열 수" value={generalKpis?.totalQueues} />
        <Kpi label="총 실제 이용자 수" value={generalKpis?.totalActual} />
        <Kpi label="이탈율" value={generalKpis ? `${(generalKpis.churnRate*100).toFixed(1)} %` : undefined} />
        <Kpi label="첫 이용까지 걸린 시간(분)" value={generalKpis?.firstUseMinutes?.toFixed?.(1)} />
        <Kpi label="총 이탈 수" value={generalKpis?.totalChurn} />
      </div>
    </div>
  );
};

const Kpi: React.FC<{label:string; value:any}> = ({label, value}) => (
  <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition">
    <div className="text-gray-600 text-sm">{label}</div>
    <div className="mt-1 text-2xl font-semibold text-gray-800">{value ?? "-"}</div>
  </div>
);