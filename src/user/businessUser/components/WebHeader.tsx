import React, { useEffect, useState } from "react";
import WaitItLogo from '../../../asset/WaitItLogo.png';

type Account = { name?: string; role?: string } | null;

const Navbar: React.FC = () => {

    const [account, setAccount] = useState<Account>(null);

    useEffect(() => {
        const read = () => {
        try {
            const raw = sessionStorage.getItem("user");
            setAccount(raw ? JSON.parse(raw) : null);
        } catch {
            setAccount(null);
        }
        };
        read();

        const onStorage = (e: StorageEvent) => {
        if (e.key === "user" || e.key === "accessToken") read();
        };
        window.addEventListener("storage", onStorage);

        // 로그인 코드에서 수동으로 알릴 때 사용 (선택)
        const onAuthChanged = () => read();
        window.addEventListener("auth:changed", onAuthChanged as EventListener);

        return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener("auth:changed", onAuthChanged as EventListener);
        };
    }, []);

    // 역할별 마이페이지 경로
    const myPageHref =
        (account?.role || "").toUpperCase() === "ROLE_ADMIN"
        ? "/mypage"
        : "/mypage";

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3" aria-label="Home">
            <img src={WaitItLogo} alt="Wait:It Logo" className="h-10 w-auto object-contain" />
            </a>

            <nav className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
            <a href="#about" className="hover:text-black">ABOUT</a>
            <a href="#business" className="hover:text-black">BUSINESS</a>
            <a href="#app" className="hover:text-black">APP</a>
            </nav>

            <div className="flex items-center gap-3">
            {account ? (
                <a
                href={myPageHref}
                className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                마이페이지
                </a>
            ) : (
                <a href="/login" className="text-sm font-medium text-gray-700 hover:text-black">
                로그인 / 회원가입
                </a>
            )}
            </div>
        </div>
        </header>
    );
};

export default Navbar;