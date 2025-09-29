import React, { useEffect, useState } from "react";
import logo from "../../../asset/195698700.png"

export type PageKey = "insight" | "peak" | "general";

const EyeIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ACACAC"><path d="M1.2 12S5 5.5 12 5.5 22.8 12 22.8 12 19 18.5 12 18.5 1.2 12 1.2 12Zm10.8 3.1a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z"/></svg>
);
const FlameIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ACACAC"><path d="M12 2s3 3 3 6-2 4-2 6 2 3 2 5a5 5 0 0 1-10 0c0-4 5-7 5-11 0-2-1-4-1-6 0 0 1 0 3 0Z"/></svg>
);
const GraphIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ACACAC"><path d="M4 20h16v2H2V2h2v18Zm3-2h3V9H7v9Zm5 0h3V4h-3v14Zm5 0h3v-7h-3v7Z"/></svg>
);
const Logo = () => (
    <img src={logo} alt="waitIt Logo" className="w-12 h-12 object-contain" />
);

export const DefaultProfile: React.FC = () => {
    return(
        <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
            <svg
                className="w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                {/* 머리 */}
                <circle cx="12" cy="8" r="4" />
                {/* 몸통 */}
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6v2H4v-2z" />
            </svg>
        </div>
    );
}

type IconProps = React.SVGProps<SVGSVGElement>;
const PdfIcon: React.FC<IconProps> = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#ACACAC" aria-hidden="true">
        {/* 본문(종이) */}
        <path d="M6 2h8.8c.5 0 1 .2 1.4.6l3.2 3.2c.4.4.6.9.6 1.4V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2z" />
        {/* 접힌 모서리 */}
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
    profileName?: string;
    onDownload?: () => void;
}


export const TopBar: React.FC<HeaderProps> = ({ page, onNavigate, profileName = "OOO", onDownload }) => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
}, []);

    return (
        <header className="w-full bg-[#2B3036] backdrop-blur sticky top-0 z-30">
            <div className="max-w-[1200px] mx-auto flex items-center gap-3 px-4 py-3 text-slate-200">
                <div className="flex items-center gap-2 font-semibold">
                    <Logo />
                </div>
                <div className="ml-2 flex items-center gap-2 bg-[#41474D] rounded-lg px-3 py-4">
                    <DefaultProfile />
                    <span className="text-sm opacity-90">{profileName} 님</span>
                    <span className="ml-4 text-sm text-[#ACACAC]">{formatKST(now)}</span>
                </div>
                <nav className="ml-auto flex items-center gap-4">
                    <button onClick={() => onNavigate("general")} 
                        className={`group flex items-center px-3 py-4 rounded-xl text-sm transition-all duration-300 bg-[#41474D] hover:bg-[#41474D] hover:max-w-[160px] overflow-hidden
                            ${page === "general" ? "bg-[#41474D] text-white max-w-[160px]" : "text-slate-300"}`}> 
                            <GraphIcon />
                            <span className={`whitespace-nowrap overflow-hidden translate-all duration-300 opacity-0 group-hover:opacity-100 group-hover:w-auto text-[#ACACAC]
                                ${page === "general" ? "opacity-100" : "opacity-0 w-0"}`}>
                                일반지표</span>
                    </button>
                    <button onClick={() => onNavigate("peak")} 
                        className={`group flex items-center px-3 py-4 rounded-xl text-sm transition-all duration-300 bg-[#41474D] hover:bg-[#41474D] hover:max-w-[160px] overflow-hidden
                            ${page === "peak" ? "bg-[#41474D] text-white max-w-[160px]" : "text-slate-300"}`}> 
                            <FlameIcon />
                            <span className={`whitespace-nowrap overflow-hidden translate-all duration-300 opacity-0 group-hover:opacity-100 group-hover:w-auto text-[#ACACAC]
                                ${page === "peak" ? "opacity-100" : "opacity-0 w-0"}`}>
                                피크분석</span>
                    </button>
                    <button onClick={() => onNavigate("insight")} 
                        className={`group flex items-center px-3 py-4 rounded-xl text-sm transition-all duration-300 bg-[#41474D] hover:bg-[#41474D] hover:max-w-[160px] overflow-hidden
                            ${page === "insight" ? "bg-[#41474D] text-white max-w-[160px]" : "text-slate-300"}`}> 
                            <EyeIcon />
                            <span className={`whitespace-nowrap overflow-hidden translate-all duration-300 opacity-0 group-hover:opacity-100 group-hover:w-auto text-[#ACACAC]
                                ${page === "insight" ? "opacity-100" : "opacity-0 w-0"}`}>
                                    인사이트</span>
                    </button>
                    <button onClick={onDownload}
                            className={`group flex items-center px-3 py-4 rounded-xl text-sm transition-all duration-300 bg-[#41474D] hover:bg-[#41474D]`}>
                    <PdfIcon className="shrink-0" />
                    <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-[140px] text-[#ACACAC]`}>
                                    PDF로 다운로드</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};