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

  // ✅ 색상 팔레트 (라이트 테마)
  const barColor = "#cbd5e1"; // gray-300
  const lineColor = "#3b82f6"; // blue-500
  const gridColor = "#e5e7eb"; // gray-200
  const axisText = "#6b7280"; // gray-500
  const titleText = "#111827"; // gray-900

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* 상단: 토글 버튼 */}
      <div className="flex justify-between items-center mb-2 px-2 gap-2">
        <h3 className="font-semibold text-base" style={{ color: titleText }}>
          피크분석
        </h3>

        <div className="flex flex-wrap gap-2">
          {/* 막대 버튼 */}
          <button
            onClick={() => setShowBar((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition 
              ${showBar
                ? "bg-blue-100 text-blue-700 border-blue-300 shadow-inner"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: barColor }}
            />
            시간대 별 분포
          </button>

          {/* 라인 버튼 */}
          <button
            onClick={() => setShowLine((v) => !v)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition 
              ${showLine
                ? "bg-blue-100 text-blue-700 border-blue-300 shadow-inner"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: lineColor }}
            />
            체류시간분포
          </button>
        </div>
      </div>

      {/* 그래프 */}
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[340px]">
        {/* Y grid + labels */}
        {Array.from(y.ticks(5)).map((t) => (
          <g key={t}>
            <line
              x1={m.left}
              x2={w - m.right}
              y1={y(t)}
              y2={y(t)}
              stroke={gridColor}
            />
            <text
              x={m.left - 8}
              y={y(t)}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs"
              fill={axisText}
            >
              {t}
            </text>
          </g>
        ))}

        {/* X labels */}
        {data.map((d) => (
          <g key={d.x} transform={`translate(${x(d.x)},0)`}>
            <text
              x={x.bandwidth() / 2}
              y={h - m.bottom + 18}
              textAnchor="middle"
              className="text-xs"
              fill={axisText}
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
              opacity={1}
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
                  width={168}
                  height={64}
                  fill="#ffffff"
                  stroke={gridColor}
                />
                <text
                  x={cx + 16}
                  y={m.top + 24}
                  className="text-xs"
                  fill="#111827"
                >
                  시간 {d.x}시
                </text>
                <text
                  x={cx + 16}
                  y={m.top + 42}
                  className="text-xs"
                  fill="#374151"
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