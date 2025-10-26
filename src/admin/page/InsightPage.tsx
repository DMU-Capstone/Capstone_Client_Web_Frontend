import React, { useMemo } from "react";
import { Donut } from "../charts/Donut";
import { LineChart } from "../charts/LineChart";
import { useDashboardAll } from "../hooks/useBiz";

export const InsightPage: React.FC = () => {
  const params = useMemo(
    () => ({
      storeId: 1,
      dateRange: "2025-10-01~2025-10-07",
    }),
    []
  );

  const { returnDonut, insightSeries, loading, err, raw } = useDashboardAll(params);

  const donutValues = [
    {
      label: "신규 방문 고객",
      value: returnDonut.find((d) => d.label === "new")?.value ?? 0,
      color: "#3B82F6", // blue-500
    },
    {
      label: "재방문 고객",
      value: returnDonut.find((d) => d.label === "returning")?.value ?? 0,
      color: "#22C55E", // green-500
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 재방문율 */}
      <section className="rounded-2xl bg-white p-5 lg:col-span-1 flex flex-col items-center justify-center shadow-sm border border-gray-200">
        <h3 className="text-gray-800 font-semibold mb-2">재방문율</h3>
        <Donut values={donutValues} />
        {loading && <div className="mt-2 text-sm text-gray-500">로딩 중…</div>}
      </section>

      {/* 예상 대기인원 추이 */}
      <section className="rounded-2xl bg-white p-5 lg:col-span-2 shadow-sm border border-gray-200">
        <h3 className="text-gray-800 font-semibold mb-2">예상 대기인원 추이</h3>
        {err && <div className="text-red-500 text-sm mb-2">{err}</div>}
        <LineChart
          data={insightSeries}
          series={[
            { key: "expected", label: "예상", color: "#3B82F6" },
            { key: "actual", label: "실제", color: "#9CA3AF" }, // gray-400
          ]}
        />
        {loading && <div className="mt-2 text-sm text-gray-500">로딩 중…</div>}
      </section>

      {/* 리뷰 및 취소 사유 */}
      <section className="rounded-2xl bg-white p-5 lg:col-span-3 shadow-sm border border-gray-200">
        <h3 className="text-gray-800 font-semibold mb-2">리뷰 및 대기 취소 사유</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {/* 취소 사유 도넛 */}
          <Donut
            values={(raw?.reviewAndCancelStats.cancelReasons ?? []).map((c) => ({
              label: c.reason,
              value: Math.round((c.percentage ?? 0) * 100), // 0~1 → %
              color: "#3B82F6", // blue-500
            }))}
          />

          {/* 리뷰 리스트 */}
          <ul className="space-y-2 text-sm text-gray-700">
            {(raw?.reviewAndCancelStats.reviews ?? [])
              .slice(0, 6)
              .map((r, i) => (
                <li
                  key={i}
                  className="rounded-xl px-3 py-2 border border-gray-200 bg-gray-50"
                >
                  <span className="font-medium text-gray-900">
                    {r.date} ★{r.rating}
                  </span>{" "}
                  {r.comment}
                </li>
              ))}
          </ul>
        </div>
      </section>
    </div>
  );
};