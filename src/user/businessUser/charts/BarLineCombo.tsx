import * as d3 from "d3";
import React, { useRef, useState, useEffect } from "react";

function useResizeObserver2<T extends HTMLElement>(
    ref: React.RefObject<T> | React.MutableRefObject<T | null>
) {
    const [rect, setRect] = useState<DOMRect | null>(null);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new ResizeObserver(([e]) => setRect(e.contentRect as DOMRect));
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return rect;
}

export const BarLineCombo: React.FC<{
    data: Array<{ x: number; bar: number; line: number }>;
}> = ({ data }) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const rect = useResizeObserver2(wrapRef);

    const m = { top: 16, right: 24, bottom: 36, left: 40 };
    const w = Math.max(320, rect?.width ?? 720);
    const h = 320;

    const x = d3
        .scaleBand<number>()
        .domain(data.map((d) => d.x))
        .range([m.left, w - m.right])
        .padding(0.2);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => Math.max(d.bar, d.line)) ?? 0])
        .nice()
        .range([h - m.bottom, m.top]);

    const line = d3
        .line<typeof data[number]>()
        .x((d) => x(d.x)! + x.bandwidth() / 2)
        .y((d) => y(d.line))
        .curve(d3.curveMonotoneX);

    // ✅ 토글 상태
    const [showBar, setShowBar] = useState(true);
    const [showLine, setShowLine] = useState(true);
    const [hover, setHover] = useState<number | null>(null);

    // ✅ 버튼 색 원과 차트 색상 통일
    const barColor = "#e5e7eb";
    const lineColor = "#60a5fa";

    return (
        <div ref={wrapRef} className="relative w-full">
        {/* 상단: 토글 버튼 (라인차트와 동일 스타일) */}
        <div className="flex justify-between items-center mb-2 px-2 gap-2">
            <h3 className="text-slate-200 font-semibold">피크분석</h3>
            <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setShowBar((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-[#3A4046] text-slate-200/90 hover:bg-[#424950] transition"
                style={{
                    border: "none",
                    boxShadow: showBar ? "0 2px 0 0 #ACACAC" : "none",
                }}
            >
            <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: barColor }}
            />
            시간대 별 분포
            </button>

            <button
                onClick={() => setShowLine((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-[#3A4046] text-slate-200/90 hover:bg-[#424950] transition"
                style={{
                    border: "none",
                    boxShadow: showLine ? "0 2px 0 0 #ACACAC" : "none",
                }}
            >
            <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: lineColor }}
            />
            체류시간분포
            </button>
            </div>
        </div>

        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[340px]">
            {/* Y grid + labels (#ACACAC) */}
            {Array.from(y.ticks(5)).map((t) => (
            <g key={t}>
                <line
                    x1={m.left}
                    x2={w - m.right}
                    y1={y(t)}
                    y2={y(t)}
                    stroke="#ACACAC"
                    opacity={0.2}
                />
                <text
                    x={m.left - 8}
                    y={y(t)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs"
                    fill="#ACACAC"
                >
                {t}
                </text>
            </g>
            ))}

            {/* X labels (#ACACAC) */}
            {data.map((d) => (
            <g key={d.x} transform={`translate(${x(d.x)},0)`}>
                <text
                    x={x.bandwidth() / 2}
                    y={h - m.bottom + 18}
                    textAnchor="middle"
                    className="text-xs"
                    fill="#ACACAC"
                >
                {d.x}
                </text>
            </g>
            ))}

            {/* Bars */}
            {showBar &&
            data.map((d) => (
                <rect
                    key={`b-${d.x}`}
                    x={x(d.x)}
                    y={y(d.bar)}
                    width={x.bandwidth()}
                    height={y(0) - y(d.bar)}
                    fill={barColor}
                    opacity={0.9}
                    onMouseEnter={() => setHover(d.x)}
                    onMouseLeave={() => setHover(null)}
                />
            ))}

            {/* Line */}
            {showLine && (
            <path
                d={line(data) ?? undefined}
                fill="none"
                stroke={lineColor}
                strokeWidth={2}
            />
            )}
            {showLine &&
            data.map((d) => (
                <circle
                    key={`c-${d.x}`}
                    cx={x(d.x)! + x.bandwidth() / 2}
                    cy={y(d.line)}
                    r={3}
                    fill={lineColor}
                    onMouseEnter={() => setHover(d.x)}
                    onMouseLeave={() => setHover(null)}
                />
            ))}

            {/* Hover tooltip */}
            {hover !== null &&
            (() => {
                const d = data.find((v) => v.x === hover)!;
                const cx = x(d.x)! + x.bandwidth() / 2;
                return (
                <g>
                    <line
                        x1={cx}
                        x2={cx}
                        y1={m.top}
                        y2={h - m.bottom}
                        stroke="#93c5fd"
                        strokeDasharray="4 4"
                    />
                    <rect
                        x={cx + 8}
                        y={m.top}
                        rx={8}
                        className="fill-slate-800/90"
                        width={160}
                        height={60}
                    />
                    <text x={cx + 16} y={m.top + 22} className="fill-white text-xs">
                    시간 {d.x}시
                    </text>
                    <text
                        x={cx + 16}
                        y={m.top + 40}
                        className="fill-slate-200 text-xs"
                    >
                    막대: {d.bar} / 선: {d.line}
                    </text>
                </g>
                );
            })()}
        </svg>
        </div>
    );
};