import * as d3 from 'd3';
import React, { useRef, useState, useEffect } from "react";


export interface Series { 
    key: string; 
    label: string; 
    color: string; 
}
export interface LineChartProps {
    data: Array<{ x: number; [k: string]: number }>;
    series: Series[];
}


function useResizeObserver(ref: React.RefObject<HTMLElement>) {
    const [rect, setRect] = useState<DOMRect | null>(null);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new ResizeObserver(([e]) => setRect(e.contentRect as DOMRect));
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref]);
    return rect;
}


export const LineChart: React.FC<LineChartProps> = ({ data, series }) => {
	const wrapRef = useRef<HTMLDivElement>(null);
	const rect = useResizeObserver(wrapRef);
	const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(series.map(s => [s.key, true])));
	const [hover, setHover] = useState<{ x: number; yByKey: Record<string, number> } | null>(null);


	const m = { top: 16, right: 24, bottom: 36, left: 40 };
	const w = Math.max(320, (rect?.width ?? 720));
	const h = 320;


	const visibleSeries = series.filter(s => enabled[s.key]);
	const x = d3.scaleLinear().domain(d3.extent(data, d => d.x) as [number, number]).range([m.left, w - m.right]);
	const yMax = d3.max(data, d => d3.max(visibleSeries, s => d[s.key])) ?? 0;
	const y = d3.scaleLinear().domain([0, Math.max(10, yMax)]).nice().range([h - m.bottom, m.top]);
	const lineGen = (key: string) => d3.line<{x:number}>().x(d => x(d.x)).y(d => y((d as any)[key])).curve(d3.curveMonotoneX);


return (
	<div ref={wrapRef} className="w-full">
		<svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[340px] text-slate-400">
			{Array.from(x.ticks(8)).map(t => (
				<g key={t} transform={`translate(${x(t)},0)`}>
					<line y1={m.top} y2={h - m.bottom} stroke="currentColor" opacity={0.15} />
					<text y={h - m.bottom + 18} textAnchor="middle" className="fill-current text-xs">{t}</text>
				</g>
			))}
			{Array.from(y.ticks(5)).map(t => (
				<g key={t}>
					<line x1={m.left} x2={w - m.right} y1={y(t)} y2={y(t)} stroke="currentColor" opacity={0.15} />
					<text x={m.left - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" className="fill-current text-xs">{t}</text>
				</g>
			))}

			{series.map(s => enabled[s.key] && (
				<g key={s.key}>
					<path d={lineGen(s.key)(data as any) ?? undefined} fill="none" stroke={s.color} strokeWidth={2} />
					{data.map((d,i) => (
						<circle key={i} cx={x(d.x)} cy={y((d as any)[s.key])} r={3} fill={s.color}
							onMouseEnter={() => setHover({ x: d.x, yByKey: Object.fromEntries(series.map(ss => [ss.key, (d as any)[ss.key]])) })}
							onMouseLeave={() => setHover(null)} />
					))}
				</g>
			))}

			{hover && (
				<g>
					<line x1={x(hover.x)} x2={x(hover.x)} y1={m.top} y2={h - m.bottom} stroke="#93c5fd" strokeDasharray="4 4" />
					<rect x={x(hover.x) + 8} y={m.top} rx={8} className="fill-slate-800/90" width={160} height={series.filter(s=>enabled[s.key]).length * 20 + 32} />
					<text x={x(hover.x) + 16} y={m.top + 20} className="fill-white text-xs">{`시간 ${hover.x}시`}</text>
					{series.filter(s=>enabled[s.key]).map((s, idx) => (
						<text key={s.key} x={x(hover.x) + 16} y={m.top + 40 + idx * 18} className="fill-slate-200 text-xs">
							<tspan fill={s.color}>● </tspan>{s.label}: {hover.yByKey[s.key]}
						</text>
					))}
				</g>
			)}
		</svg>
		<div className="mt-3 flex flex-wrap gap-2">
			{series.map(s => (
				<button key={s.key} onClick={() => setEnabled(v => ({ ...v, [s.key]: !v[s.key] }))}
					className={`px-3 py-1.5 rounded-full text-xs border transition ${enabled[s.key] ? "bg-slate-800/70 border-slate-700 text-white" : "bg-transparent border-slate-700 text-slate-400 line-through"}`}
					style={{ boxShadow: enabled[s.key] ? "inset 0 0 0 2px " + s.color : undefined }}>
					{s.label}
				</button>
			))}
		</div>
	</div>
	);
};