import React, { useMemo } from "react";
import { BarLineCombo } from "../charts/BarLineCombo";
import { useDashboardAll } from "../hooks/useBiz";

export const PeakPage: React.FC = () => {
  const params = useMemo(
    () => ({
      storeId: 1,
      dateRange: "2025-10-01~2025-10-07",
    }),
    []
  );
  const { peakSeries, loading, err, raw } = useDashboardAll(params);

  // 임시 KPI: 서버 값으로 적절히 뽑아서 표시
  const avgProcSec = Math.round(
    (raw?.peakAnalysis.reduce((s, p) => s + (p.averageProcessingSpeedSeconds ?? 0), 0) || 0) /
      (raw?.peakAnalysis.length || 1)
  );

  const avgDropPct = Math.round(
    (((raw?.peakAnalysis.reduce((s, p) => s + (p.dropoutRate ?? 0), 0) || 0) /
      (raw?.peakAnalysis.length || 1)) *
      100)
  );

  return (
    <div className="space-y-6">
      {/* 그래프 카드 */}
      <section className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          {err && <div className="text-red-500 text-sm">{err}</div>}
        </div>
        <BarLineCombo data={peakSeries} />
        {loading && <div className="mt-2 text-sm text-gray-500">로딩 중…</div>}
      </section>

      {/* KPI 카드 */}
      <div className="grid sm:grid-cols-3 gap-4 text-center">
        <Stat label="자원 대비 수용 효율" value="-" />
        <Stat label="평균 처리속도(초)" value={avgProcSec} accent="text-blue-600" />
        <Stat label="피크타임 이탈률(평균)" value={`${avgDropPct}%`} accent="text-rose-600" />
      </div>
    </div>
  );
};

const Stat: React.FC<{ label: string; value: any; accent?: string }> = ({
  label,
  value,
  accent = "text-gray-900",
}) => (
  <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
    <div className="text-gray-500 text-sm mb-1">{label}</div>
    <div className={`text-2xl font-semibold ${accent}`}>{value ?? "-"}</div>
  </div>
);