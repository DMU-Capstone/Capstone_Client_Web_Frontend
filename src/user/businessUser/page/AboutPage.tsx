import React from "react";

// ✅ 헤더/푸터: 경로만 프로젝트에 맞게 조정
import WebHeader from "../components/WebHeader";
import WebFooter from "../components/WebFooter";

// ✅ 안내 이미지: 경로만 맞추면 됩니다 (예: src/assets/guide/1.png ...)
import Img1 from "../../../asset/About/1.png";
import Img2 from "../../../asset/About/2.png";
import Img3 from "../../../asset/About/3.png";
import Img4 from "../../../asset/About/4.png";
import Img5 from "../../../asset/About/5.png";
import Img6 from "../../../asset/About/6.png";

const PhoneFrame: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <div className="rounded-[28px] border border-gray-200 shadow-sm overflow-hidden bg-white max-w-[320px]">
    {/* 필요하면 테두리/노치 등을 더 꾸밀 수 있어요 */}
    <img {...props} className="w-full h-auto block select-none" loading="lazy" />
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode; sub?: string }> = ({ children, sub }) => (
  <div className="text-center mb-6">
    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{children}</h2>
    {sub && <p className="mt-2 text-sm text-gray-500">{sub}</p>}
  </div>
);

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EEF5FF] via-white to-white text-gray-900">
      <WebHeader />

      <main className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-16">

        {/* 1. 첫 소개 */}
        <section className="flex flex-col items-center">
          <SectionTitle>
            로그인하여 Wait:It 서비스를 이용해보세요
          </SectionTitle>
          <PhoneFrame src={Img3} alt="로그인/가입 안내 화면" />
        </section>

        {/* 2. 바로되는 가입/로그인 */}
        <section className="flex flex-col items-center">
          <SectionTitle>비회원도 가능해요!</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center">
            <PhoneFrame src={Img6} alt="간편 가입 화면" />
            <PhoneFrame src={Img5} alt="회원/대기 등록 화면" />
          </div>
        </section>

        {/* 3. 기다리기 지루할땐? 주변 매장 */}
        <section className="flex flex-col items-center">
          <SectionTitle sub="주변 매장에서 시간을 보낼 수도 있습니다.">
            기다리기 지루할땐?
          </SectionTitle>
          <PhoneFrame src={Img2} alt="주변 매장 리스트 화면" />
        </section>

        {/* 4. 매장 상세/지도/키워드 */}
        <section className="flex flex-col items-center">
          <SectionTitle>매장 상세 정보와 위치 확인</SectionTitle>
          <PhoneFrame src={Img4} alt="매장 상세/지도/키워드 화면" />
        </section>

        {/* 5. 지금 바로 시작 */}
        <section className="flex flex-col items-center">
          <SectionTitle>지금 바로 시작해보세요!</SectionTitle>
          <PhoneFrame src={Img1} alt="시작하기 랜딩 화면" />
          <a
            href="/download"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-white text-sm font-semibold hover:bg-blue-700 transition"
          >
            앱 다운로드
          </a>
        </section>
      </main>

      <WebFooter />
    </div>
  );
};

export default AboutPage;