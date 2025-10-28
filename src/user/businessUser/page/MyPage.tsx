import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/WebHeader";
import Footer from "../components/WebFooter";

type Account = {
  id?: string | number;
  name?: string;
  role?: string;
  phoneNumber?: string;
  storeId?: string | number;
  hostId?: string | number;
  userId?: string | number;
  username?: string;
} | null;

// 세션에서 user 정보 읽기
function getSessionUser(): any | null {
  try {
    const raw = sessionStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// 가능한 키 중 하나를 ID로 사용
function getEffectiveId(u: any | null): string | null {
  if (!u) return null;
  const cand =
    u.id ?? u.storeId ?? u.hostId ?? u.userId ?? u.username ?? null;
  return cand != null ? String(cand) : null;
}

const MyPage: React.FC = () => {
  const [account, setAccount] = useState<Account>(null);

  useEffect(() => {
    setAccount(getSessionUser());
  }, []);

  const displayName = account?.name || "닉네임";
  const myStoreId = useMemo(() => getEffectiveId(account), [account]);

  const Row: React.FC<
    React.PropsWithChildren<{ label: string; href?: string; onClick?: () => void }>
  > = ({ label, href, onClick }) => (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center justify-between py-3 text-[15px] text-gray-900 hover:bg-gray-50 rounded-lg px-1 transition"
    >
      <span>{label}</span>
      <span className="text-gray-400">{">"}</span>
    </a>
  );

  return (
    <div className="min-h-dvh flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-[480px] px-4 sm:px-6 lg:px-8 py-4">
          {/* 상단 바 */}
          <div className="h-10 flex items-center">
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={() => window.history.back()}
              className="p-2 -ml-2 rounded hover:bg-gray-100 active:scale-95 transition"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M15.5 5.5 9 12l6.5 6.5-1.5 1.5L6 12l8-8 1.5 1.5z" />
              </svg>
            </button>
            <h1 className="ml-2 text-[18px] font-extrabold">마이페이지</h1>
          </div>

          {/* 프로필 카드 */}
          <div className="mt-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                {/* 프로필 이미지 자리 */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  IMG
                </div>
              </div>
              <div className="flex-1">
                <div className="text-[18px] font-semibold text-gray-900">
                  {displayName}
                </div>
                {account?.phoneNumber && (
                  <div className="text-sm text-gray-500">
                    {account.phoneNumber}
                  </div>
                )}
              </div>
            </div>

            {/* 상단 버튼 */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href="/mypage/profile"
                className="h-10 rounded-full border border-gray-300 bg-white text-gray-800 text-sm font-medium flex items-center justify-center hover:bg-gray-50 active:scale-[0.99]"
              >
                프로필 수정
              </a>
              <a
                href="/mypage/reservations"
                className="h-10 rounded-full border border-gray-300 bg-white text-gray-800 text-sm font-medium flex items-center justify-center hover:bg-gray-50 active:scale-[0.99]"
              >
                예약 내역
              </a>
            </div>
          </div>

          {/* 대기 관련 정보 */}
          <div className="mt-6">
            <div className="text-xs text-gray-400 mb-2">대기 관련 정보</div>
            <div className="rounded-xl border border-gray-200 p-3">
              <Row label="현재 활성화 호스트" href="/stores/55" />
              <Row label="호스트 생성" href="/queue/register" />
              <Row label="대시보드" href="/admin/dashboard" />
            </div>
          </div>

          {/* 기타 기능 */}
          <div className="mt-6">
            <div className="text-xs text-gray-400 mb-2">기타 기능</div>
            <div className="rounded-xl border border-gray-200 p-3">
              <Row label="알림 설정" href="/mypage/settings/notifications" />
              <Row label="SNS 연동" href="/mypage/settings/social" />
              <Row label="1:1 문의" href="/support/contact" />
              <Row label="공지사항 및 이용약관" href="/legal" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MyPage;