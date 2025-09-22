import React from "react";
import { BarLineCombo } from "../charts/BarLineCombo";
import { peakData } from "../data/mock";


export const PeakPage: React.FC = () => (
    <div className="space-y-6">
        <section className="rounded-2xl bg-slate-800/60 p-4">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-slate-200 font-semibold">피크분석</h3>
                <div className="text-xs text-slate-400">토글 온/오프 · 호버 툴팁</div>
            </div>
            <BarLineCombo data={peakData} />
        </section>
        <div className="grid sm:grid-cols-3 gap-4 text-center">
            {[
                { label: "자원 대비 수용 효율", value: "65%" },
                { label: "평균 처리속도", value: "40.5" },
                { label: "피크타임 서비스 변동률", value: "43.8" },
            ].map((m, i) => (
                <div key={i} className="rounded-2xl bg-slate-800/60 p-4">
                    <div className="text-slate-300 text-sm mb-1">{m.label}</div>
                    <div className="text-2xl font-semibold text-slate-100">{m.value}</div>
                </div>
            ))}
        </div>
    </div>
);