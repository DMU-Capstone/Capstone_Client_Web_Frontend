import React from "react";
import Navbar from "../components/WebHeader";
import Footer from "../components/WebFooter";

const Landing: React.FC = () => {
    
    return (
        <div className="min-h-dvh flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">
            {/* 히어로 */}
            <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 mt-10">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div>
                <p className="text-blue-700 font-bold text-xl">편리한 줄서기 어플</p>
                <h1 className="mt-3 text-5xl font-extrabold tracking-tight">Wait:It</h1>
                <p className="mt-4 text-gray-600">
                    다양한 편의기능부터 이용자 데이터분석까지!
                </p>
                </div>
                <div className="relative w-full h-[420px] bg-gray-100 rounded-3xl shadow-inner flex items-center justify-center">
                <div className="w-[260px] h-[360px] bg-white rounded-[36px] shadow-xl border border-gray-200" />
                </div>
            </div>
            </section>

            {/* 목차 섹션 앵커 */}
            <section
                id="support"
                className="mx-auto w-full max-w-[900px] px-4 sm:px-6 lg:px-8 mt-24 mb-24"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 자주찾는질문 */}
                    <div className="border border-gray-300 p-6 rounded-md hover:shadow-md transition relative">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">자주찾는질문</h3>
                        <span className="text-2xl font-bold text-gray-700">+</span>
                    </div>

                    <ul className="mt-3 space-y-2 text-gray-500 text-sm leading-relaxed">
                        <li>· 앱에 대해</li>
                        <li>· 분석 페이지에 대해</li>
                        <li>· 접속이 안돼요</li>
                    </ul>

                    {/* 말풍선 아이콘 */}
                    <div className="absolute bottom-4 right-4 opacity-20">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-16 h-16 text-gray-400"
                        >
                        <path d="M2 3a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H7l-4.5 4.5A.7.7 0 0 1 2 20V3z" />
                        </svg>
                    </div>
                    </div>

                    {/* 고객문의 */}
                    <div className="border border-gray-300 p-6 rounded-md hover:shadow-md transition relative">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">고객문의</h3>
                        <span className="text-2xl font-bold text-gray-700">+</span>
                    </div>

                    <p className="mt-3 text-gray-600 text-sm">1:1 전화 상담과 게시판</p>

                    {/* 전화 아이콘 */}
                    <div className="absolute inset-0 pointer-events-none flex items-end justify-end p-8 opacity-20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="5 -1 24 24"   // ← 여백 포함한 넉넉한 viewBox
                            className="w-12 h-12 text-gray-400"
                            fill="currentColor"
                            aria-hidden
                        >
                            <path d="M21.7 16.8a17 17 0 0 1-7.5-7.5l1.7-1.7a1 1 0 0 0 .2-1.1L13.3 2.4a1 1 0 0 0-1.1-.6l-4 1a1 1 0 0 0-.7.9c0 9.4 7.7 17.1 17.1 17.1a1 1 0 0 0 .9-.7l1-4a1 1 0 0 0-.6-1.1l-3.1-2a1 1 0 0 0-1.1.2l-1.6 1.6z" />
                        </svg>
                    </div>
                    </div>
                </div>
            </section>
        </main>
        <Footer />
        </div>
    );
};

export default Landing;