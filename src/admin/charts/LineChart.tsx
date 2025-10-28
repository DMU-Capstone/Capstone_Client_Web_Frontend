import * as d3 from "d3";
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

type Datum = { x: number } & Record<string, number>;

function useResizeObserver<T extends HTMLElement>(
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

export const LineChart: React.FC<LineChartProps> = ({ data, series }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rect = useResizeObserver(wrapRef);

  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    () => Object.fromEntries(series.map((s) => [s.key, true])) as Record<string, boolean>
  );
  const [hover, setHover] = useState<{ x: number; yByKey: Record<string, number> } | null>(null);

  const m = { top: 16, right: 24, bottom: 36, left: 40 };
  const w = Math.max(320, rect?.width ?? 720);
  const h = 320;

  const visibleSeries = series.filter((s) => enabled[s.key]);
  const x = d3.scaleLinear().domain(d3.extent(data, (d) => d.x) as [number, number]).range([m.left, w - m.right]);
  const yMax = d3.max(data, (d) => d3.max(visibleSeries, (s) => d[s.key])) ?? 0;
  const y = d3.scaleLinear().domain([0, Math.max(10, yMax)]).nice().range([h - m.bottom, m.top]);

  const lineGen = (key: string) =>
    d3.line<Datum>().x((d) => x(d.x)).y((d) => y(d[key])).curve(d3.curveMonotoneX);

  return (
    <div ref={wrapRef} className="relative w-full">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-gray-800 font-semibold">일반 지표</h3>

        {/* 🔆 라이트 테마 범례 버튼 */}
        <div className="flex flex-wrap gap-2">
          {series.map((s) => {
            const isOn = enabled[s.key];
            const base =
              "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs border transition shadow-sm";
            const onCls =
              "bg-blue-50 text-blue-700 border-blue-200";
            const offCls =
              "bg-white text-gray-700 border-gray-200 hover:bg-gray-50";
            return (
              <button
                key={s.key}
                onClick={() => setEnabled((v) => ({ ...v, [s.key]: !v[s.key] }))}
                className={`${base} ${isOn ? onCls : offCls}`}
                style={{
                  boxShadow: isOn ? "inset 0 0 0 1px rgba(59,130,246,0.25)" : "none",
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[340px] text-slate-400">
        {/* X grid + labels */}
        {Array.from(x.ticks(8)).map((t) => (
          <g key={t} transform={`translate(${x(t)},0)`}>
            <line y1={m.top} y2={h - m.bottom} stroke="#ACACAC" opacity={0.2} />
            <text y={h - m.bottom + 18} textAnchor="middle" className="text-xs" fill="#6B7280">
              {t}
            </text>
          </g>
        ))}

        {/* Y grid + labels */}
        {Array.from(y.ticks(5)).map((t) => (
          <g key={t}>
            <line x1={m.left} x2={w - m.right} y1={y(t)} y2={y(t)} stroke="#ACACAC" opacity={0.2} />
            <text
              x={m.left - 8}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs"
              fill="#6B7280"
            >
              {t}
            </text>
          </g>
        ))}

        {/* series lines + points */}
        {series.map(
          (s) =>
            enabled[s.key] && (
              <g key={s.key}>
                <path d={lineGen(s.key)(data as Datum[]) ?? undefined} fill="none" stroke={s.color} strokeWidth={2} />
                {data.map((d, i) => (
                  <circle
                    key={i}
                    cx={x(d.x)}
                    cy={y((d as Datum)[s.key])}
                    r={3}
                    fill={s.color}
                    onMouseEnter={() => {
                      const yByKey = series.reduce<Record<string, number>>((acc, ss) => {
                        acc[ss.key] = (d as Datum)[ss.key];
                        return acc;
                      }, {});
                      setHover({ x: d.x, yByKey });
                    }}
                    onMouseLeave={() => setHover(null)}
                  />
                ))}
              </g>
            )
        )}

        {/* hover tooltip (다크 팝오버 유지 / 필요시 라이트 팝오버로 바꿔도 OK) */}
        {hover && (
          <g>
            <line x1={x(hover.x)} x2={x(hover.x)} y1={m.top} y2={h - m.bottom} stroke="#93c5fd" strokeDasharray="4 4" />
            <rect
              x={x(hover.x) + 8}
              y={m.top}
              rx={8}
              className="fill-slate-800/90"
              width={160}
              height={visibleSeries.length * 20 + 32}
            />
            <text x={x(hover.x) + 16} y={m.top + 20} className="fill-white text-xs">{`시간 ${hover.x}시`}</text>
            {visibleSeries.map((s, idx) => (
              <text key={s.key} x={x(hover.x) + 16} y={m.top + 40 + idx * 18} className="fill-slate-200 text-xs">
                <tspan fill={s.color}>● </tspan>
                {s.label}: {hover.yByKey[s.key]}
              </text>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};