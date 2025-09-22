import React, { useState } from "react";
import { TopBar, type PageKey } from "../components/Header";
import { InsightPage } from "./InsightPage";
import { PeakPage } from "./PeakPage";
import { GeneralPage } from "./GeneralPage";


const Dashboard: React.FC = () => {
const [page, setPage] = useState<PageKey>("general");
return (
<div className="min-h-screen bg-slate-900 text-slate-100">
<TopBar page={page} onNavigate={setPage} />
<main className="max-w-[1200px] mx-auto px-4 py-6">
{page === "insight" && <InsightPage />}
{page === "peak" && <PeakPage />}
{page === "general" && <GeneralPage />}
</main>
</div>
);
};


export default Dashboard;