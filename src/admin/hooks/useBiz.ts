import { useEffect, useState } from "react";
import {
  fetchDashboardAll,
  adaptGeneralSeries, adaptInsightSeries, adaptReturnDonut, adaptPeakSeries, adaptGeneralKpis,
  type DashboardAllResponse
} from "../services/biz.service";

export type UseBizParams = { storeId: number | string; dateRange: string };

export function useDashboardAll(params: UseBizParams) {
  const [data, setData] = useState<DashboardAllResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setErr(""); setLoading(true);
      const d = await fetchDashboardAll(params);
      setData(d);
    } catch (e: any) {
      setErr(e.message || "로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [params.storeId, params.dateRange]);

  return {
    raw: data,
    generalKpis: data ? adaptGeneralKpis(data) : null,
    generalSeries: data ? adaptGeneralSeries(data) : [],
    insightSeries: data ? adaptInsightSeries(data) : [],
    returnDonut: data ? adaptReturnDonut(data) : [],
    peakSeries: data ? adaptPeakSeries(data) : [],
    loading, err, refetch: load
  };
}