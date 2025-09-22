import React, { useEffect, useState } from "react";


export type PageKey = "insight" | "peak" | "general";


const EyeIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1.2 12S5 5.5 12 5.5 22.8 12 22.8 12 19 18.5 12 18.5 1.2 12 1.2 12Zm10.8 3.1a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z"/></svg>
);
const FlameIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s3 3 3 6-2 4-2 6 2 3 2 5a5 5 0 0 1-10 0c0-4 5-7 5-11 0-2-1-4-1-6 0 0 1 0 3 0Z"/></svg>
);
const GraphIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 20h16v2H2V2h2v18Zm3-2h3V9H7v9Zm5 0h3V4h-3v14Zm5 0h3v-7h-3v7Z"/></svg>
);
const LogoHourglass = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12v4l-3.5 4 3.5 4v6H6v-6l3.5-4L6 6V2Zm2 4 4 4 4-4V4H8v2Zm8 12v-3.172L12 12l-4 2.828V18h8Z"/></svg>
);


function formatKST(date: Date) {
    const y = date.getFullYear();
    const m = `${date.getMonth() + 1}`.padStart(2, "0");
    const d = `${date.getDate()}`.padStart(2, "0");
    const hh = `${date.getHours()}`.padStart(2, "0");
    const mm = `${date.getMinutes()}`.padStart(2, "0");
    return `${y}. ${m}. ${d} ${hh}:${mm}`;
}


export interface TopBarProps {
    page: PageKey;
    onNavigate: (p: PageKey) => void;
    profileName?: string;
}


export const TopBar: React.FC<TopBarProps> = ({ page, onNavigate, profileName = "OOO" }) => {
    const [now, setNow] = useState(() => new Date());
    useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
}, []);

    return (
        <header className="w-full bg-slate-900/80 backdrop-blur sticky top-0 z-30">
            <div className="max-w-[1200px] mx-auto flex items-center gap-3 px-4 py-3 text-slate-200">
                <div className="flex items-center gap-2 font-semibold">
                    <LogoHourglass />
                    <span className="text-slate-100">Wait·It</span>
                </div>
                <div className="ml-2 flex items-center gap-2">
                    <div className="w-8 h-4 rounded-full bg-slate-700" />
                    <span className="text-sm opacity-90">{profileName}</span>
                </div>
                <div className="ml-4 text-sm text-slate-300">{formatKST(now)}</div>
                <nav className="ml-auto flex items-center gap-2">
                    <button onClick={() => onNavigate("insight")} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition hover:bg-slate-800 ${page === "insight" ? "bg-slate-800 text-white" : "text-slate-300"}`}> <EyeIcon /><span className="hidden sm:inline">인사이트</span></button>
                    <button onClick={() => onNavigate("peak")} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition hover:bg-slate-800 ${page === "peak" ? "bg-slate-800 text-white" : "text-slate-300"}`}> <FlameIcon /><span className="hidden sm:inline">피크분석</span></button>
                    <button onClick={() => onNavigate("general")} className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition hover:bg-slate-800 ${page === "general" ? "bg-slate-800 text-white" : "text-slate-300"}`}> <GraphIcon /><span className="hidden sm:inline">일반지표</span></button>
                </nav>
            </div>
        </header>
        );
};