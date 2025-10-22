import React from "react";
import { LineChart } from "../charts/LineChart";
import { generalData, generalSeries } from "../data/mock";


export const GeneralPage: React.FC = () => (
    <div className="space-y-6">
        <section className="rounded-2xl bg-[#41474D] p-4">
            
            <LineChart data={generalData} series={[...generalSeries]} />
        </section>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
                { label: "총 방문자 수", value: 235, accent: "text-emerald-400" },
                { label: "총 대기열 수", value: 187, accent: "text-emerald-400" },
                { label: "총 실제 이용자 수", value: 230, accent: "text-emerald-400" },
                { label: "이탈율", value: "2.5 %", accent: "text-slate-300" },
                { label: "첫 이용까지 걸린 시간", value: 2.3, accent: "text-rose-400" },
                { label: "총 이탈 수", value: 5, accent: "text-slate-300" },
            ].map((kpi, i) => (
                <div key={i} className="rounded-2xl bg-slate-800/60 p-4 text-center">
                    <div className="text-slate-300 text-sm">{kpi.label}</div>
                    <div className={`mt-1 text-2xl font-semibold ${kpi.accent}`}>{kpi.value}</div>
                </div>
            ))}
        </div>
    </div>
);