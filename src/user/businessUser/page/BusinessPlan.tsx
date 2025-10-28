import React from "react";

// ⬇️ 프로젝트 위치에 맞게 경로만 조정하세요.
import WebHeader from "../components/WebHeader";
import WebFooter from "../components/WebFooter";

const BusinessPlanPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <WebHeader />

      {/* 헤더 높이 보정 (sticky header h-20 기준 여백) */}
      <main className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* 상단 카피 */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-gray-300 line-through select-none">
              10,990
            </span>
          </div>
          <p className="text-[22px] sm:text-2xl leading-snug">
            월 <span className="font-semibold text-gray-900">6,990</span> 원에 사업 운영에 필요한
            <br className="hidden sm:block" />
            다양한 분석 데이터를 받아보세요!
          </p>
        </div>

        {/* 플랜 카드 */}
        <div className="flex justify-center">
          <div className="w-full max-w-[360px] rounded-xl border border-gray-300 bg-white">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Business PLAN</h2>
            </div>

            <ul className="px-6 py-5 space-y-3 text-sm text-gray-400">
              <li>대기열 생성 및 관리</li>
              <li>실시간 모니터링</li>
              <li>차트 및 데이터 제공</li>
              <li>효율적인 회원 관리</li>
            </ul>

            <div className="px-6 pb-6">
              <button
                className="w-full h-11 rounded-lg bg-[#3B5AD8] text-white text-sm font-semibold hover:brightness-105 active:translate-y-[1px] transition"
                type="button"
              >
                PLAN 추가
              </button>
            </div>
          </div>
        </div>
      </main>

      <WebFooter />
    </div>
  );
};

export default BusinessPlanPage;