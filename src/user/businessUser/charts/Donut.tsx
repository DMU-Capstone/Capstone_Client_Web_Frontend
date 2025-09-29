import * as d3 from "d3";
import React from "react";

type Datum = { label: string; value: number; color: string };

export const Donut: React.FC<{ values: Datum[] }> = ({ values }) => {
    const size = 240;
    const inner = 80;
    const outer = 110;

    const total = d3.sum(values, (d) => d.value);

    const arcs = d3.pie<Datum>().sort(null).value((d) => d.value)(values);
    const arc = d3.arc<d3.PieArcDatum<Datum>>().innerRadius(inner).outerRadius(outer);

    const svgWidth = 380;
    const svgHeight = size;

    return (
        <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full max-w-[380px] h-auto"
        >
        {/* 도넛 차트 */}
        <g transform={`translate(${size / 2},${size / 2})`}>
            {arcs.map((a, i) => (
            <path key={i} d={arc(a)!} fill={a.data.color} />
            ))}
            <text
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-slate-200 text-xl font-semibold"
            >
            {Math.round(((values[1]?.value ?? 0) / (total || 1)) * 100)}%
            </text>
        </g>

        <g transform={`translate(${size + 20}, ${svgHeight / 2 - values.length * 10})`}>
            {values.map((v, i) => (
            <g key={i} transform={`translate(0, ${i * 20})`}>
                <rect width={10} height={10} fill={v.color} rx={2} />
                <text x={16} y={9} className="fill-slate-300 text-xs">
                {v.label}
                </text>
            </g>
            ))}
        </g>
        </svg>
    );
};