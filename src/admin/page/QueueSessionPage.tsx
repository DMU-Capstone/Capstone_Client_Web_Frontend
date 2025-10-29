import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiGet, API_BASE_URL } from "../../utils/api";
import ProtectedImg from "../components/ProtectedImg";

type PageResp<T> = {
  content: T[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

type AdminHostItem = {
  id: number;
  name?: string;        // API마다 다르므로 optional
  hostName?: string;

  hostImage?: {
    id: number;
    imagePath: string;
    createdAt: string;
    representative: boolean;
  } | null;

  // 다른 응답 대비
  imgUrl?: string;
  imagePath?: string;
};

const toAbsolute = (p?: string) =>
  !p ? "" : p.startsWith("http")
    ? encodeURI(p)                                   // 외부 URL도 안전하게
    : `${API_BASE_URL}${encodeURI(p)}`;              // ← 경로 부분만 encode
const getDisplayName = (h: AdminHostItem) =>
  (h.name && h.name.trim()) ||
  (h.hostName && h.hostName.trim()) ||
  `호스트 #${h.id}`;
const getImageUrl = (h: AdminHostItem) =>
  toAbsolute(h.hostImage?.imagePath || h.imagePath || h.imgUrl || "");

const AdminHostsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [resp, setResp] = useState<PageResp<AdminHostItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchHosts = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await apiGet<PageResp<AdminHostItem>>(
        `/admin/hosts?page=${page}&size=${size}`
      );
      if (!res.success) throw new Error(res.message || "목록을 불러오지 못했습니다.");
      setResp(res.data!);
    } catch (e: any) {
      setErr(e?.message ?? "알 수 없는 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHosts(); }, [page, size]);

  const total = resp?.totalElements ?? 0;

  // ✅ 검색도 표시용 이름으로 수행 (undefined 안전)
  const filtered = useMemo(() => {
    const list = resp?.content ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((x) => getDisplayName(x).toLowerCase().includes(q));
  }, [resp, search]);



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 flex">
        <Sidebar selectedMenu="매장관리" onSelectMenu={() => {}} />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">실시간 대기열 관리</h1>
            <p className="text-sm text-gray-500 mt-1">총 {total}개</p>
          </div>

          {/* 검색 + 페이지크기 */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex-1 relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="매장명으로 검색…"
                className="w-full h-10 pl-10 pr-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l4.387 4.387-1.414 1.414-4.387-4.387zM8 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd"/>
              </svg>
            </div>
            <select
              className="h-10 px-3 rounded-lg border border-gray-300 bg-white"
              value={size}
              onChange={(e) => { setPage(1); setSize(Number(e.target.value)); }}
              title="페이지 크기"
            >
              {[10, 20, 50].map(n => <option key={n} value={n}>{n}개</option>)}
            </select>
            <button
              onClick={fetchHosts}
              className="h-10 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              새로고침
            </button>
          </div>

          {/* 목록 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="hidden lg:grid grid-cols-[80px_1fr_120px] px-4 py-3 text-xs font-semibold text-gray-500 border-b">
              <div>이미지</div>
              <div>이름</div>
              <div className="text-right pr-2">관리</div>
            </div>

            {loading && <div className="p-6 text-sm text-gray-500">불러오는 중…</div>}
            {err && <div className="p-6 text-sm text-red-600">{err}</div>}
            {!loading && !err && filtered.length === 0 && (
              <div className="p-6 text-sm text-gray-500">표시할 항목이 없습니다.</div>
            )}

            {!loading && !err && filtered.map((h) => {
              const displayName = getDisplayName(h);
              const img = getImageUrl(h);

              return (
                <div
                  key={h.id}
                  className="grid grid-cols-1 lg:grid-cols-[80px_1fr_120px] items-center gap-3 px-4 py-3 border-t first:border-t-0"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <ProtectedImg
                      path={h.hostImage?.imagePath}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{displayName}</div>
                    <div className="text-xs text-gray-500">ID: {h.id}</div>
                  </div>

                  <div className="flex lg:justify-end gap-2">
                    <button
                      className="h-9 px-3 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
                      onClick={() => (window.location.href = `/admin/stores/${h.id}`)}
                    >
                      상세
                    </button>
                    <button
                      className="h-9 px-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm"
                      onClick={() => alert("추후: 수정/정지 등 관리 기능")}
                    >
                      관리
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {resp && resp.totalPages > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                총 {resp.totalElements}개 · {resp.page}/{resp.totalPages} 페이지
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 h-9 rounded border border-gray-300 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  이전
                </button>
                <button
                  className="px-3 h-9 rounded border border-gray-300 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(resp.totalPages, p + 1))}
                  disabled={resp && page >= resp.totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminHostsPage;