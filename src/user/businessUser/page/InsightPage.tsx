import React from "react";
import { Donut } from "../charts/Donut";
import { LineChart } from "../charts/LineChart";
import { generalData, generalSeries } from "../data/mock";


export const InsightPage: React.FC = () => (
    <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-[#41474D] p-4 lg:col-span-1 flex flex-col items-center justify-center">
            <h3 className="text-slate-200 font-semibold mb-2">재방문율</h3>
            <Donut values={[
                { label: "신규 방문 고객", value: 45, color: "#60a5fa" },
                { label: "재방문 고객", value: 155, color: "#22c55e" },
            ]} />
        </section>
        <section className="rounded-2xl bg-[#41474D] p-4 lg:col-span-2">
            <h3 className="text-slate-200 font-semibold mb-2">예상 대기인원 추이</h3>
            <LineChart data={generalData} series={[generalSeries[0], generalSeries[1]]} />
        </section>
        <section className="rounded-2xl bg-[#41474D] p-4 lg:col-span-3">
            <h3 className="text-slate-200 font-semibold mb-2">리뷰 및 대기 취소 사유</h3>
            <div className="grid sm:grid-cols-2 gap-4">
                <Donut values={[
                    { label: "지루해서", value: 24, color: "#60a5fa" },
                    { label: "다른 일정과 겹침", value: 12, color: "#f59e0b" },
                    { label: "기타", value: 8, color: "#22c55e" },
                ]}/>
                <ul className="space-y-2 text-sm text-slate-300">
                    {Array.from({length:6}).map((_,i) => (
                        <li key={i} className="rounded-xl bg-#ACACAC px-3 py-2 border border-slate-700">25/09/{10-i} 사장님이 친절하고 서비스가 좋았어요</li>
                    ))}
                </ul>
            </div>
        </section>
    </div>
);