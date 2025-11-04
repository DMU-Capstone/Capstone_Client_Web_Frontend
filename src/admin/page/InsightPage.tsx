import React from "react";
import { Donut } from "../charts/Donut";
import { LineChart } from "../charts/LineChart";
import { useDashboardAll } from "../hooks/useBiz";

export const InsightPage: React.FC<{ storeId: number; dateRange: string }> = ({ storeId, dateRange }) => {
  const { returnDonut, insightSeries, loading, err, raw } = useDashboardAll({ storeId, dateRange });

  const donutValues = [
    { label: "신규 방문 고객", value: returnDonut.find(d => d.label === "new")?.value ?? 0,       color: "#60a5fa" },
    { label: "재방문 고객",   value: returnDonut.find(d => d.label === "returning")?.value ?? 0, color: "#22c55e" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="rounded-2xl bg-white p-4 shadow-md border border-gray-200 flex flex-col items-center">
        <h3 className="text-gray-800 font-semibold mb-2">재방문율</h3>
        <Donut values={donutValues} />
        {loading && <div className="mt-2 text-sm text-gray-500">로딩 중…</div>}
      </section>

      <section className="rounded-2xl bg-white p-4 lg:col-span-2">
        <h3 className="text-gray-800 font-semibold mb-2">예상 대기인원 추이</h3>
        {err && <div className="text-rose-400 text-sm mb-2">{err}</div>}
        <LineChart
          data={insightSeries}
          series={[
            { key: "expected", label: "예상", color: "#60a5fa" },
            { key: "actual",   label: "실제", color: "#e5e7eb" },
          ]}
        />
      </section>

      <section className="rounded-2xl bg-white p-4 lg:col-span-3">
        <h3 className="text-gray-800 font-semibold mb-2">리뷰 및 대기 취소 사유</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Donut
            values={(raw?.reviewAndCancelStats.cancelReasons ?? []).map(c => ({
              label: c.reason,
              value: Math.round((c.percentage ?? 0) * 100),
              color: "#60a5fa",
            }))}
          />
          <ul className="space-y-2 text-sm text-slate-300">
            {(raw?.reviewAndCancelStats.reviews ?? []).slice(0, 6).map((r, i) => (
              <li key={i} className="rounded-xl px-3 py-2 border border-slate-700">
                {r.date} ★{r.rating} {r.comment}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};