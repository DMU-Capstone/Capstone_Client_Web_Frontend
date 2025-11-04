import React, { useEffect, useState } from "react";
import logo from "../../asset/195698700.png";

export type PageKey = "insight" | "peak" | "general";

// ✅ 다양한 소스(/stores, /admin/hosts 등)를 수용
export type StoreOption = {
  id: number;
  title?: string;    // /stores 기준
  name?: string;     // 다른 API 대비
  hostName?: string; // 다른 API 대비
};

const EyeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6B7280">
    <path d="M1.2 12S5 5.5 12 5.5 22.8 12 22.8 12 19 18.5 12 18.5 1.2 12 1.2 12Zm10.8 3.1a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" />
  </svg>
);
const FlameIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6B7280">
    <path d="M12 2s3 3 3 6-2 4-2 6 2 3 2 5a5 5 0 0 1-10 0c0-4 5-7 5-11 0-2-1-4-1-6 0 0 1 0 3 0Z" />
  </svg>
);
const GraphIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6B7280">
    <path d="M4 20h16v2H2V2h2v18Zm3-2h3V9H7v9Zm5 0h3V4h-3v14Zm5 0h3v-7h-3v7Z" />
  </svg>
);
const Logo = () => <img src={logo} alt="WaitIt Logo" className="w-12 h-12 object-contain" />;

export const DefaultProfile: React.FC = () => (
  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
    <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6v2H4v-2z" />
    </svg>
  </div>
);

type IconProps = React.SVGProps<SVGSVGElement>;
const PdfIcon: React.FC<IconProps> = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6B7280" aria-hidden="true">
    <path d="M6 2h8.8c.5 0 1 .2 1.4.6l3.2 3.2c.4.4.6.9.6 1.4V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z" />
    <path d="M15 2v3.8c0 .7.5 1.2 1.2 1.2H20" className="opacity-80" />
  </svg>
);

function formatKST(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  const hh = `${date.getHours()}`.padStart(2, "0");
  const mm = `${date.getMinutes()}`.padStart(2, "0");
  return `${y}. ${m}. ${d} ${hh}:${mm}`;
}

export interface HeaderProps {
  page: PageKey;
  onNavigate: (p: PageKey) => void;
  onDownload?: () => void;

  selectedStoreId?: number | null;
  onChangeStoreId?: (id: number) => void;
  hosts?: StoreOption[];
}

// ✅ 라벨: title > name > hostName > #id
const getOptionLabel = (h: StoreOption) =>
  (h.title && h.title.trim()) ||
  (h.name && h.name.trim()) ||
  (h.hostName && h.hostName.trim()) ||
  `호스트 #${h.id}`;

export const TopBar: React.FC<HeaderProps> = ({
  page,
  onNavigate,
  onDownload,
  selectedStoreId,
  onChangeStoreId,
  hosts = [],
}) => {
  const [now, setNow] = useState(() => new Date());
  const [profileName, setProfileName] = useState<string>("사용자");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user?.name) setProfileName(user.name);
      } catch (e) {
        console.error("사용자 정보 파싱 오류:", e);
      }
    }
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1200px] mx-auto flex items-center gap-3 px-4 py-3 text-gray-800">
        {/* <Logo /> */}

        {/* 프로필 + 시간 */}
        <div className="ml-2 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-3">
          <DefaultProfile />
          <span className="text-sm font-medium text-gray-700">{profileName} 님</span>
          <span className="ml-4 text-sm text-gray-400">{formatKST(now)}</span>
        </div>

        {/* ✅ 호스트 선택: 제목 우선 표시 */}
        <div className="ml-4">
          <label className="text-xs text-gray-500 mr-2">호스트</label>
          <select
            value={selectedStoreId ?? ""}
            onChange={(e) => onChangeStoreId?.(Number(e.target.value))}
            className="h-10 px-3 rounded-lg border border-gray-300 bg-white"
            title="대시보드 대상 호스트 선택"
          >
            {hosts.length === 0 ? (
              <option value="">호스트 없음</option>
            ) : (
              hosts.map((h) => (
                <option key={h.id} value={h.id}>
                  {getOptionLabel(h)}
                </option>
              ))
            )}
          </select>
        </div>

        {/* 탭 */}
        <nav className="ml-auto flex items-center gap-4">
          <button
            onClick={() => onNavigate("general")}
            className={`group flex items-center px-3 py-3 rounded-xl text-sm transition-all duration-300 ${
              page === "general" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-blue-50"
            }`}
          >
            <GraphIcon />
            <span className={`whitespace-nowrap ml-2 ${page === "general" ? "font-semibold text-blue-700" : "text-gray-600"}`}>
              일반지표
            </span>
          </button>

          <button
            onClick={() => onNavigate("peak")}
            className={`group flex items-center px-3 py-3 rounded-xl text-sm transition-all duration-300 ${
              page === "peak" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-blue-50"
            }`}
          >
            <FlameIcon />
            <span className={`whitespace-nowrap ml-2 ${page === "peak" ? "font-semibold text-blue-700" : "text-gray-600"}`}>
              피크분석
            </span>
          </button>

          <button
            onClick={() => onNavigate("insight")}
            className={`group flex items-center px-3 py-3 rounded-xl text-sm transition-all duration-300 ${
              page === "insight" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-blue-50"
            }`}
          >
            <EyeIcon />
            <span className={`whitespace-nowrap ml-2 ${page === "insight" ? "font-semibold text-blue-700" : "text-gray-600"}`}>
              인사이트
            </span>
          </button>

          <button
            onClick={onDownload}
            className="group flex items-center px-3 py-3 rounded-xl text-sm bg-gray-100 hover:bg-blue-50 transition-all duration-300"
          >
            <PdfIcon className="shrink-0" />
            <span className="ml-2 text-gray-600 group-hover:text-blue-600">PDF로 다운로드</span>
          </button>
        </nav>
      </div>
    </header>
  );
};