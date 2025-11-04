import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestService from "../services/GuestService";
import { API_BASE_URL } from "../../utils/api";

const FIXED_HOST_ID = 57;

const GuestQueue: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("대기열");
  const [peopleAhead, setPeopleAhead] = useState<number>(0);
  const [queueCode, setQueueCode] = useState<string>("WAIT-57-ABCD"); // 예시 코드 (실제는 등록 후 전달받을 수 있음)
  const [phoneNumber] = useState<string>("010-1234-5678");
  const [name] = useState<string>("홍길동");
  const [count] = useState<number>(2);

  const identity = { phoneNumber, name, count };

  // ── 57 고정으로 제목과 대기 인원 불러오기 ──────────────────────────────
  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        // 호스트 제목
        const hostRes = await fetch(`${API_BASE_URL}/host/${FIXED_HOST_ID}`, {
          headers: { Accept: "application/json" },
        });
        if (hostRes.ok) {
          const hostJson = await hostRes.json();
          setTitle(hostJson?.hostName ?? `호스트 #${FIXED_HOST_ID}`);
        }

        // 대기열 인원
        const waitingRes = await fetch(`${API_BASE_URL}/host/waiting/${FIXED_HOST_ID}`, {
          headers: { Accept: "application/json" },
        });
        if (waitingRes.ok) {
          const json = await waitingRes.json();
          if (Array.isArray(json)) {
            const total = json.reduce(
              (sum: number, item: { count?: number }) => sum + (Number(item?.count) || 0),
              0
            );
            setPeopleAhead(total);
          } else if (typeof json?.count === "number") {
            setPeopleAhead(json.count);
          }
        }
      } catch (err) {
        console.error("정적 데이터 불러오기 실패", err);
      }
    };

    fetchStaticData();
  }, []);

  // ── 기능들 ─────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(queueCode);
      }
      alert("대기 코드를 복사했습니다.");
    } catch {
      alert("복사에 실패했습니다. 수동으로 복사해주세요.");
    }
  };

  const handleCancel = async () => {
    try {
      await GuestService.cancelQueue(String(FIXED_HOST_ID), identity);
      alert("대기열이 취소되었습니다.");
      navigate("/");
    } catch (err) {
      console.error("대기열 취소 실패", err);
      alert("대기열 취소 중 오류가 발생했습니다.");
    }
  };

  const handleDelay = async () => {
    try {
      await GuestService.delayQueue(String(FIXED_HOST_ID), identity);
      alert("대기가 미뤄졌습니다.");
      window.location.reload();
    } catch (err) {
      console.error("대기 미루기 실패", err);
      alert("대기를 미루는 중 오류가 발생했습니다.");
    }
  };

  const progressPct = Math.min((peopleAhead / 10) * 100, 100);

  // ── 렌더링 ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* 상단: 뒤로가기 + 제목 */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b">
        <div className="max-w-[480px] mx-auto px-4 h-12 flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="p-2 -ml-2 rounded hover:bg-gray-100 active:scale-95 transition"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M15.5 5.5 9 12l6.5 6.5-1.5 1.5L6 12l8-8 1.5 1.5z" />
            </svg>
          </button>
          <h1 className="text-[15px] font-semibold truncate">{title}</h1>
        </div>
      </div>

      {/* 본문 */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-[480px] px-4 py-4">
          <div className="w-full rounded-xl border border-gray-100 shadow-sm p-5">
            {/* 상태 */}
            <div className="mb-2 text-center">
              <span role="img" aria-label="user">👥</span>{" "}
              앞에 <strong>{peopleAhead}명</strong> 대기 중
            </div>

            {/* 진행바 */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* 대기 코드 */}
            <div className="text-center mb-2 text-sm text-gray-500">나의 대기열 코드</div>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full border border-gray-200 rounded-lg py-2 px-3 font-bold tracking-wide bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition"
              title="클릭하면 복사됩니다"
            >
              {queueCode}
            </button>
            <div className="text-center text-gray-400 text-xs mt-1 mb-4">
              누르면 복사됩니다
            </div>

            {/* 버튼 영역 */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button
                type="button"
                disabled
                className="h-10 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"
              >
                로그인 후 알림받기
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="h-10 rounded-md border border-red-300 text-red-600 hover:bg-red-50 active:scale-[0.99] transition"
              >
                대기 취소
              </button>
            </div>

            <button
              type="button"
              onClick={handleDelay}
              className="w-full h-10 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99] transition"
            >
              대기 미루기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestQueue;