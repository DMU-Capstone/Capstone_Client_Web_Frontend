import React from "react";
import { BarLineCombo } from "../charts/BarLineCombo";
import { useDashboardAll } from "../hooks/useBiz";

export const PeakPage: React.FC<{ storeId: number; dateRange: string }> = ({ storeId, dateRange }) => {
  const { peakSeries, loading, err, raw } = useDashboardAll({ storeId, dateRange });

  const avgProcSec = Math.round(
    (raw?.peakAnalysis.reduce((s, p) => s + (p.averageProcessingSpeedSeconds ?? 0), 0) || 0) /
    (raw?.peakAnalysis.length || 1)
  );
  const avgDropPct = Math.round(
    ((raw?.peakAnalysis.reduce((s, p) => s + (p.dropoutRate ?? 0), 0) || 0) /
    (raw?.peakAnalysis.length || 1)) * 100
  );

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-white p-4 shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          {err && <div className="text-red-500 text-sm">{err}</div>}
        </div>
        <BarLineCombo data={peakSeries} />
        {loading && <div className="mt-2 text-sm text-gray-500">로딩 중…</div>}
      </section>

      <div className="grid sm:grid-cols-3 gap-4 text-center">
        <Stat label="자원 대비 수용 효율" value="-" />
        <Stat label="평균 처리속도(초)" value={avgProcSec} />
        <Stat label="피크타임 이탈률(평균)" value={`${avgDropPct}%`} />
      </div>
    </div>
  );
};

const Stat: React.FC<{label:string; value:any}> = ({label, value}) => (
  <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
    <div className="text-gray-600 text-sm mb-1">{label}</div>
    <div className="text-2xl font-semibold text-gray-800">{value ?? "-"}</div>
  </div>
);