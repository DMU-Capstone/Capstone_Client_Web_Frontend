import { apiGet } from "../../../utils/api";              // 너의 fetch 유틸 (apiGet)
import { BIZ_ENDPOINTS } from "../../../utils/apiEndpoints";

/** 쿼리 파라미터 */
export type DashQuery = {
  storeId: number | string;
  /** 서버가 요구하는 dateRange 형식. 예: "2025-10-01~2025-10-07" 또는 "2025-10-01" */
  dateRange: string;
};

/** Swagger 응답 타입(그대로 매핑) */
export type DashboardAllResponse = {
  storeMetrics: {
    summary: {
      totalWaitlistCount: number;
      totalActualUsers: number;
      totalDropouts: number;
      dropoutRate: number; // 0~1
      averageWaitTimeSeconds: number;
    };
    hourlyData: Array<{
      timeSlot: string;     // "HH:mm" 또는 "YYYY-MM-DD HH:mm"
      waitlistCount: number;
      actualUsers: number;
      dropouts: number;
    }>;
  };
  peakAnalysis: Array<{
    timeSlot: string;
    customersServed: number;
    averageProcessingSpeedSeconds: number;
    dropoutRate: number; // 0~1
  }>;
  returnRate: {
    totalVisitors: number;
    newVisitors: number;
    returningVisitors: number;
    returnRate: number; // 0~1
  };
  waitlistTrend: Array<{
    timeSlot: string;
    waitlistCount: number;
    utilizationRate: number; // 0~1
  }>;
  reviewAndCancelStats: {
    cancelReasons: Array<{ reason: string; percentage: number }>; // 0~1
    reviews: Array<{ date: string; rating: number; comment: string }>;
  };
};

// -----------------------------
// 차트 컴포넌트들이 기대하는 형태로 변환
// -----------------------------

/** LineChart 기대 형태: data: Array<{ x: number; [seriesKey]: number }> */
export type LineDatum = { x: number } & Record<string, number>;

/** GeneralPage 라인차트용 변환 (시간대 → x 인덱스) */
export function adaptGeneralSeries(src: DashboardAllResponse): LineDatum[] {
  const rows = src.storeMetrics.hourlyData ?? [];
  return rows.map((r, i) => ({
    x: i,
    visitors: r.waitlistCount,  // 필요 시 의미에 맞게 수정
    queues: r.actualUsers,
    actual: r.dropouts,
  }));
}

/** InsightPage 라인차트용 변환(예상 vs 실제) – 예: waitlistTrend + storeMetrics.actualUsers */
export function adaptInsightSeries(src: DashboardAllResponse): LineDatum[] {
  const trend = src.waitlistTrend ?? [];
  const actual = src.storeMetrics.hourlyData ?? [];
  const len = Math.max(trend.length, actual.length);

  const out: LineDatum[] = [];
  for (let i = 0; i < len; i++) {
    out.push({
      x: i,
      expected: trend[i]?.waitlistCount ?? 0,
      actual: actual[i]?.actualUsers ?? 0,
    });
  }
  return out;
}

/** Donut 기대 형태: { label, value, color }[] 는 페이지에서 색 입힐 예정 */
export function adaptReturnDonut(src: DashboardAllResponse) {
  const r = src.returnRate;
  return [
    { label: "new",       value: r?.newVisitors ?? 0 },
    { label: "returning", value: r?.returningVisitors ?? 0 },
  ];
}

/** BarLineCombo 기대 형태: Array<{ x:number; bar:number; line:number }> */
export function adaptPeakSeries(src: DashboardAllResponse) {
  const arr = src.peakAnalysis ?? [];
  return arr.map((a, i) => ({
    x: i,
    bar: a.customersServed,
    line: a.averageProcessingSpeedSeconds, // 필요 시 단위 변환
  }));
}

/** KPI 카드에 쓰일 요약값 */
export function adaptGeneralKpis(src: DashboardAllResponse) {
  const s = src.storeMetrics.summary;
  return {
    totalVisitors: src.returnRate.totalVisitors,
    totalQueues: s.totalWaitlistCount,
    totalActual: s.totalActualUsers,
    churnRate: s.dropoutRate,                       // 0~1
    firstUseMinutes: (s.averageWaitTimeSeconds ?? 0) / 60,
    totalChurn: s.totalDropouts,
  };
}

// -----------------------------
// API 호출
// -----------------------------

const withQuery = (base: string, q: DashQuery) =>
  `${base}?storeId=${encodeURIComponent(String(q.storeId))}&dateRange=${encodeURIComponent(q.dateRange)}`;

export async function fetchDashboardAll(q: DashQuery) {
  const res = await apiGet<DashboardAllResponse>(withQuery(BIZ_ENDPOINTS.DASHBOARD_ALL, q));
  if (!res.success) throw new Error(res.message || "대시보드 조회 실패");
  return res.data!;
}