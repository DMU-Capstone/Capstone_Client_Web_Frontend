import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import GuestService, { getQueueDetail } from "../services/GuestService";
import { createHost } from "../../utils/services/host.services";
import { filesToBase64 } from "../../utils/types/host.types";

const GuestQueue: React.FC = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	// URL 파라미터
	const queueCode = searchParams.get("code") || "";
	const queueId = searchParams.get("id") || "";
	const phoneNumber = searchParams.get("phoneNumber") || ""; // <- 오타 수정
	const name = searchParams.get("name") || "";
	const count = Number(searchParams.get("count")) || 0;

	const [peopleAhead, setPeopleAhead] = useState<number>(0);

	useEffect(() => {
		const fetchDetails = async () => {
		if (!queueId) return;
		try {
			const details = await getQueueDetail(Number(queueId));
			const totalCount = details.reduce(
			(sum: number, item: { count: number }) => sum + item.count,
			0
			);
			setPeopleAhead(totalCount);
		} catch (err) {
			console.error("대기열 정보 불러오기 실패", err);
		}
		};
		fetchDetails();
	}, [queueId]);

	const handleCopy = async () => {
		try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(queueCode);
		} else {
			// fallback
			const ta = document.createElement("textarea");
			ta.value = queueCode;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand("copy");
			document.body.removeChild(ta);
		}
		alert("대기 코드를 복사했습니다.");
		} catch {
		alert("복사에 실패했습니다. 수동으로 복사해주세요.");
		}
	};

	const identity = { phoneNumber, name, count };

	const handleCancel = async () => {
		try {
		await GuestService.cancelQueue(queueId, identity);
		alert("대기열이 취소되었습니다.");
		navigate("/");
		} catch (err) {
		console.error("대기열 취소 실패", err);
		alert("대기열 취소 중 오류가 발생했습니다.");
		}
	};

	const handleDelay = async () => {
		if (!queueId || !queueCode) return;
		try {
		await GuestService.delayQueue(queueId, identity);
		alert("대기가 미뤄졌습니다.");
		window.location.reload();
		} catch (err) {
		console.error("대기 미루기 실패", err);
		alert("대기를 미루는 중 오류가 발생했습니다.");
		}
	};

	// 진행바 너비 (예: 10명 기준 100%)
	const progressPct = Math.min((peopleAhead / 10) * 100, 100);

	return (
		<div className="min-h-dvh bg-white flex justify-center">
		<div className="w-full max-w-[480px] px-4 py-4">
			{/* 카드 */}
			<div className="w-full rounded-xl border border-gray-100 shadow-sm p-5">
			{/* 상단 상태 */}
			<div className="mb-2 text-center">
				<span role="img" aria-label="user">
				👥
				</span>{" "}
				앞에 <strong>{peopleAhead}명</strong> 대기 중
			</div>

			{/* 진행바 */}
			<div className="w-full h-1.5 bg-gray-200 rounded-full mb-4 overflow-hidden">
				<div
				className="h-full bg-indigo-600 rounded-full"
				style={{ width: `${progressPct}%` }}
				/>
			</div>

			{/* 대기 코드 */}
			<div className="text-center mb-2 text-sm text-gray-500">나의 대기열 코드</div>
			<button
				type="button"
				onClick={handleCopy}
				className="w-full border border-gray-200 rounded-lg py-2 px-3 font-bold tracking-wide bg-gray-50 hover:bg-gray-100 active:scale-[0.99] transition"
				title="클릭하면 복사됩니다"
			>
				{queueCode}
			</button>
			<div className="text-center text-gray-400 text-xs mt-1 mb-4">
				누르면 복사됩니다
			</div>

			{/* 액션 버튼들 */}
			<div className="grid grid-cols-2 gap-2 mb-2">
				<button
				type="button"
				disabled
				className="h-10 rounded-md border border-gray-200 text-gray-400 cursor-not-allowed"
				title="로그인 필요"
				>
				로그인 후 알림받기
				</button>
				<button
				type="button"
				onClick={handleCancel}
				className="h-10 rounded-md border border-red-300 text-red-600 hover:bg-red-50 active:scale-[0.99] transition"
				>
				대기 취소
				</button>
			</div>

			<button
				type="button"
				onClick={handleDelay}
				className="w-full h-10 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99] transition"
			>
				대기 미루기
			</button>
			</div>
		</div>
		</div>
	);
};

export default GuestQueue;