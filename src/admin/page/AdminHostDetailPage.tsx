import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../../utils/api";
import ProtectedImg from "../components/ProtectedImg";

type HostDetail = {
  id: number;
  imgUrl?: string;
  hostName?: string;
  maxPeople?: number;
  hostManagerName?: string;
  hostPhoneNumber?: string;
  latitude?: number;
  longitude?: number;
  keyword?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
};

const fallbackImg =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop";

const toAbsolute = (p?: string) =>
  !p ? undefined : p.startsWith("http") ? p : `${API_BASE_URL}${p}`;

const fmtTime = (s?: string) => {
  if (!s) return "-";
  try {
    const d = new Date(s);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  } catch { return s; }
};

const AdminHostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<HostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch(`${API_BASE_URL}/host/${id}`, {
          headers: { Accept: "application/json" },
          credentials: "include",
        });
        if (!res.ok) throw new Error(`조회 실패: ${res.status}`);
        const json = (await res.json()) as HostDetail;
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "호스트 정보를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const title = useMemo(
    () => data?.hostName || `호스트 #${id}`,
    [data?.hostName, id]
  );

  // 키워드 칩
  const keywords = useMemo(() => {
    const raw = data?.keyword ?? "";
    return raw
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 12);
  }, [data?.keyword]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 flex">
        <Sidebar selectedMenu="매장관리" onSelectMenu={() => {}} />

        <main className="flex-1 p-6 lg:p-8">
          {/* 상단 바 */}
          <div className="mb-6 flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="h-9 w-9 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center justify-center"
              aria-label="뒤로가기"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M15.5 5.5 9 12l6.5 6.5-1.5 1.5L6 12l8-8 1.5 1.5z" />
              </svg>
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900">{title}</h1>
          </div>

          {/* 본문 카드 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            {loading && <div className="text-sm text-gray-500">불러오는 중…</div>}
            {err && <div className="text-sm text-red-600">{err}</div>}

            {!loading && !err && data && (
              <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6">
                {/* 이미지 */}
                <div>
                  <div className="w-[200px] h-[200px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {/* imgUrl이 보호 경로가 아니라면 그냥 img src 사용해도 OK.
                       토큰이 필요한 보호 경로면 ProtectedImg로 교체 */}
                    {data.imgUrl ? (
                      <img
                        src={toAbsolute(data.imgUrl) ?? fallbackImg}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={fallbackImg}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">ID: {data.id}</div>
                </div>

                {/* 정보 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Info label="최대 수용 인원" value={data.maxPeople ?? "-"} />
                    <Info label="담당자" value={data.hostManagerName ?? "-"} />
                    <Info label="연락처" value={data.hostPhoneNumber ?? "-"} />
                    <Info label="위도/경도" value={
                      (data.latitude != null && data.longitude != null)
                        ? `${data.latitude}, ${data.longitude}`
                        : "-"
                    } />
                    <Info label="운영 시작" value={fmtTime(data.startTime)} />
                    <Info label="운영 종료" value={fmtTime(data.endTime)} />
                  </div>

                  {/* 키워드 */}
                  <div>
                    <div className="text-sm font-semibold mb-1">키워드</div>
                    {keywords.length ? (
                      <div className="flex flex-wrap gap-2">
                        {keywords.map((k, i) => (
                          <span
                            key={`${k}-${i}`}
                            className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1"
                          >
                            #{k}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">키워드 없음</div>
                    )}
                  </div>

                  {/* 소개 */}
                  <div>
                    <div className="text-sm font-semibold mb-1">소개</div>
                    <div className="rounded-lg border border-gray-200 p-3 bg-gray-50 text-sm text-gray-700 whitespace-pre-line">
                      {data.description?.trim() || "소개 정보가 없습니다."}
                    </div>
                  </div>

                  {/* 지도 링크 (옵션) */}
                  {(data.latitude != null && data.longitude != null) && (
                    <a
                      href={`https://maps.google.com/?q=${data.latitude},${data.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center h-10 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                    >
                      지도에서 보기
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Info: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 flex items-center">
      <span className="truncate">{String(value)}</span>
    </div>
  </div>
);

export default AdminHostDetailPage;