import React from "react";
import WaitItLogo from '../../../asset/WaitItLogo.png'
// 필요 시 react-router-dom 사용: import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
            <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3" aria-label="Home">
                    <img
                        src={WaitItLogo}
                        alt="Wait:It Logo"
                        className="h-10 w-auto object-contain"
                    />
                </a>

                <nav className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
                <a href="#about" className="hover:text-black">ABOUT</a>
                <a href="#business" className="hover:text-black">BUSINESS</a>
                <a href="#app" className="hover:text-black">APP</a>
                {/* 라우터를 쓰면 <Link to="/about"> 형식으로 교체 */}
                </nav>

                <div className="flex items-center gap-3">
                <a href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                    로그인 / 회원가입
                </a>
                </div>
            </div>
        </header>
    );
};

export default Navbar;