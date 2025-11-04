import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/WebHeader";
import Footer from "../components/WebFooter";
import { API_BASE_URL } from "../../../utils/api";
import { useParams } from "react-router-dom";

// 서버 응답 타입
type StoreDetail = {
  id: number;
  name: string;
  description: string;
  keyword: string;
  images: string[];
  location: {
    address: string;
    station: string;
    distance: string;
    latitude: number;
    longitude: number;
  };
  operating_hours: {
    open: string;
    close: string;
  };
};

const fallbackImg =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop";

// 상대경로 → 절대경로
const toAbsolute = (p?: string) =>
  !p ? undefined : p.startsWith("http") ? p : `${API_BASE_URL}${p}`;

const HostDetailPage: React.FC = () => {
  const [data, setData] = useState<StoreDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const res = await fetch(`${API_BASE_URL}/stores/57`, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          throw new Error(`요청 실패: ${res.status} ${res.statusText}`);
        }

        const json = (await res.json()) as StoreDetail;
        if (!alive) return;
        setData(json);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "상세 정보를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const firstImage = useMemo(
    () =>
      data?.images?.length
        ? toAbsolute(data.images[0]) ?? fallbackImg
        : fallbackImg,
    [data]
  );

  const restImages = useMemo(
    () =>
      (data?.images ?? [])
        .slice(1, 3)
        .map(toAbsolute)
        .filter(Boolean) as string[],
    [data]
  );

  const keywords = useMemo(() => {
    const raw = data?.keyword ?? "";
    return raw
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
  }, [data]);

  const [qrImgUrl, setQrImgUrl] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (qrImgUrl) URL.revokeObjectURL(qrImgUrl);
    };
  }, [qrImgUrl]);
  const targetUrl = `${window.location.origin}/guest/queue/${id}`;

  const openQrPreview = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/qrcode?url=${encodeURIComponent(targetUrl)}`,
        { headers: { Accept: "*/*" } }
      );
      if (!res.ok) throw new Error("QR 생성 실패");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setQrImgUrl(url);
      setQrOpen(true);
    } catch (e) {
      alert("QR 코드 생성에 실패했어요.");
    }
  };


  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">대기열 상세</h1>

        {err && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {err}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            <div className="h-36 bg-slate-200 rounded animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />
            ))}
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            {/* 사진 */}
            <div>
              <div className="text-sm font-semibold mb-2">사진</div>
              <div className="flex gap-3">
                <div className="w-[120px] h-[120px] rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                  <img
                    src={firstImage}
                    alt="대표 이미지"
                    className="w-full h-full object-cover"
                  />
                </div>
                {restImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="w-[120px] h-[120px] rounded border border-gray-200 overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`이미지 ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-1.5">이름</label>
                <input
                  readOnly
                  value={data.name ?? ""}
                  className="w-full h-10 rounded border border-gray-200 px-3 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  운영 시간
                </label>
                <input
                  readOnly
                  value={`${data.operating_hours?.open ?? ""} ~ ${
                    data.operating_hours?.close ?? ""
                  }`}
                  className="w-full h-10 rounded border border-gray-200 px-3 bg-gray-50"
                />
              </div>
            </div>

            {/* 위치 */}
            <div>
              <label className="block text-sm font-semibold mb-2">위치</label>
              <div className="rounded border border-gray-200 p-3">
                <div className="text-sm">
                  <div className="text-gray-700">
                    {data.location?.address || "(주소 정보 없음)"}
                  </div>
                  <div className="text-gray-500 mt-1">
                    {data.location?.station ? `${data.location.station} · ` : ""}
                    {data.location?.distance ?? ""}
                  </div>
                  {data.location?.latitude != null &&
                    data.location?.longitude != null && (
                      <div className="text-xs text-gray-500 mt-1">
                        lat {data.location.latitude}, lng{" "}
                        {data.location.longitude}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* 키워드 */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                대표 키워드
              </label>
              <div className="flex flex-wrap gap-2">
                {keywords.length > 0 ? (
                  keywords.map((k, i) => (
                    <span
                      key={`${k}-${i}`}
                      className="inline-flex items-center rounded-full bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1"
                    >
                      #{k}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">키워드 없음</span>
                )}
              </div>
            </div>

            {/* 소개 */}
            <div>
              <label className="block text-sm font-semibold mb-2">소개</label>
              <textarea
                readOnly
                rows={6}
                value={data.description ?? ""}
                className="w-full rounded border border-gray-200 px-3 py-2 bg-gray-50"
              />
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200 p-3 mt-8">
              <div className="max-w-[920px] mx-auto flex items-center justify-end">
                <button
                  onClick={openQrPreview}
                  className="inline-flex items-center gap-2 px-4 h-10 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  QR 코드 생성
                </button>
              </div>
            </div>
            {qrOpen && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-xl p-4 w-[360px]">
                  <div className="text-base font-semibold mb-3">QR 코드</div>
                  <div className="flex items-center justify-center p-3 border rounded-lg">
                    {qrImgUrl ? (
                      <img src={qrImgUrl} alt="QR" className="max-w-full h-auto" />
                    ) : (
                      <div className="text-sm text-gray-500">생성 중…</div>
                    )}
                  </div>
                  <div className="mt-4 flex gap-2 justify-end">
                    {qrImgUrl && (
                      <a
                        href={qrImgUrl}
                        download={`qrcode-${data?.id ?? "store"}.png`}
                        className="px-3 h-9 rounded-lg border border-gray-300 hover:bg-gray-50 inline-flex items-center"
                      >
                        이미지 저장
                      </a>
                    )}
                    <button
                      onClick={() => setQrOpen(false)}
                      className="px-3 h-9 rounded-lg bg-blue-600 text-white inline-flex items-center"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HostDetailPage;