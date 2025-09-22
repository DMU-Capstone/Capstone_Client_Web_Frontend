import * as d3 from "d3";
import React from "react";


export const Donut: React.FC<{ values: { label: string; value: number; color: string }[] }> = ({ values }) => {
    const size = 240; const inner = 80; const outer = 110;
    const total = d3.sum(values, d => d.value);
    const arcs = d3.pie<{label:string;value:number}>().sort(null).value(d => d.value)(values as any);
    const arc = d3.arc<d3.PieArcDatum<any>>().innerRadius(inner).outerRadius(outer);
    return (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] h-auto">
            <g transform={`translate(${size/2},${size/2})`}>
                {arcs.map((a,i) => (<path key={i} d={arc(a)!} fill={values[i].color} />))}
                <text textAnchor="middle" dominantBaseline="middle" className="fill-slate-200 text-xl font-semibold">{Math.round((values[1]?.value ?? 0)/total*100)}%</text>
            </g>
            <g transform={`translate(8,8)`}>
                {values.map((v,i) => (
                    <g key={i} transform={`translate(0, ${i*18})`}>
                        <rect width={10} height={10} fill={v.color} rx={2} />
                        <text x={16} y={9} className="fill-slate-300 text-xs">{v.label}</text>
                    </g>
                ))}
            </g>
        </svg>
    );
};