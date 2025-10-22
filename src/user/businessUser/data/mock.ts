export const generalSeries = [
    { key: "registered", label: "대기열 등록 수", color: "#22c55e" },
    { key: "util", label: "실제 이용률", color: "#3b82f6" },
    { key: "churn", label: "이탈률", color: "#ef4444" },
    { key: "avgwait", label: "평균 대기 시간", color: "#f59e0b" },
] as const;

export const generalData = [
    { x: 0, registered: 12, util: 8, churn: 1, avgwait: 5 },
    { x: 1, registered: 22, util: 18, churn: 2, avgwait: 8 },
    { x: 2, registered: 28, util: 33, churn: 3, avgwait: 9 },
    { x: 3, registered: 40, util: 39, churn: 2, avgwait: 8 },
    { x: 4, registered: 56, util: 50, churn: 1, avgwait: 7 },
    { x: 5, registered: 49, util: 46, churn: 3, avgwait: 7 },
    { x: 6, registered: 37, util: 35, churn: 2, avgwait: 6 },
    { x: 7, registered: 18, util: 30, churn: 1, avgwait: 6 },
];

export const peakData = [
    { x: 1, bar: 12, line: 10 },
    { x: 2, bar: 18, line: 15 },
    { x: 3, bar: 36, line: 30 },
    { x: 4, bar: 52, line: 50 },
    { x: 5, bar: 48, line: 46 },
    { x: 6, bar: 35, line: 30 },
    { x: 7, bar: 28, line: 24 },
];