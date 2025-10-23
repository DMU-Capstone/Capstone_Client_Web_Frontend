import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import GuestService, { getQueueDetail } from "../services/GuestService";
import { useNavigate } from "react-router-dom";

interface ActiveQueue {
  id: number;
  name: string;
  count: number;
}

type FormData = {
  phoneNumber: string;
  name: string;
  peopleCount: number;
};

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^010-\d{4}-\d{4}$/, "휴대폰 번호 형식이 올바르지 않습니다.")
    .required("휴대폰 번호는 필수입니다."),
  name: yup.string().required("대표자 이름은 필수입니다."),
  peopleCount: yup
    .number()
    .typeError("인원수는 숫자여야 합니다.")
    .min(1, "최소 1명 이상이어야 합니다.")
    .required("인원수는 필수입니다."),
});

export default function GuestQPage() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  // 활성화 큐
  const [activeHosts, setActiveHosts] = useState<ActiveQueue[]>([]);
  const [activeHostId, setActiveHostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchActiveHosts = async () => {
      try {
        const activeList = await GuestService.getActiveQueues();
        const result: ActiveQueue[] = [];

        for (const queue of activeList) {
          const details = await getQueueDetail(queue.id);
          const total = details.reduce(
            (sum: number, item: { count: number }) => sum + item.count,
            0
          );
          result.push({ id: queue.id, name: queue.name, count: total });
        }

        setActiveHosts(result);
        setActiveHostId(result[0]?.id ?? null);
        if (result.length === 0) alert("현재 활성화된 대기열이 없습니다.");
      } catch (err) {
        console.error("활성 큐 목록 불러오기 실패", err);
      }
    };
    fetchActiveHosts();
  }, []);

  const onSubmit = async (formData: FormData) => {
    if (!activeHostId) {
      alert("현재 등록 가능한 대기열이 없습니다.");
      return;
    }
    try {
      const response = await GuestService.joinQueue(String(activeHostId), {
        phoneNumber: formData.phoneNumber,
        name: formData.name,
        count: formData.peopleCount,
      });

      alert(`대기열 등록 완료! 대기코드: ${response.index}`);
      navigate(`/guest-queue?id=${activeHostId}&code=${response.index}`);

      // 등록 후 대기 인원 갱신
      const details = await getQueueDetail(activeHostId);
      const updatedCount = details.reduce(
        (sum: number, item: { count: number }) => sum + item.count,
        0
      );
      setActiveHosts(prev =>
        prev.map(q => (q.id === activeHostId ? { ...q, count: updatedCount } : q))
      );
    } catch (err) {
      console.log("대기열 등록 실패:", err);
      alert("대기열 등록에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-dvh bg-white flex justify-center">
      <div className="w-full max-w-[480px] px-4 py-4">
        <div className="h-10 flex items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="뒤로가기"
            className="p-2 -ml-2 rounded hover:bg-gray-100 active:scale-95 transition"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M15.5 5.5 9 12l6.5 6.5-1.5 1.5L6 12l8-8 1.5 1.5z" />
            </svg>
          </button>
        </div>

        <h1 className="mt-2 text-[22px] leading-7 font-extrabold">
          대기열에 등록하기 위한
          <br /> 정보를 입력해주세요.
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-semibold">참여할 대기열 선택</label>
            <select
              className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setActiveHostId(Number(e.target.value))}
              disabled={activeHosts.length === 0}
              value={activeHostId ?? ""}
            >
              {activeHosts.length === 0 ? (
                <option disabled value="">
                  현재 활성화된 대기열이 없습니다
                </option>
              ) : (
                activeHosts.map((host) => (
                  <option key={host.id} value={host.id}>
                    {host.name} (대기 {host.count}명)
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold">휴대폰 번호</label>
            <input
              type="text"
              placeholder="010-1111-1111"
              {...register("phoneNumber")}
              aria-invalid={!!errors.phoneNumber}
              className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">대표자 이름</label>
            <input
              type="text"
              placeholder="홍길동"
              {...register("name")}
              aria-invalid={!!errors.name}
              className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold">인원수</label>
            <input
              type="number"
              placeholder="1"
              {...register("peopleCount")}
              aria-invalid={!!errors.peopleCount}
              className="mt-2 w-full h-11 rounded-lg border border-gray-300 px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.peopleCount && (
              <p className="mt-1 text-xs text-red-500">{errors.peopleCount.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!activeHostId || activeHosts.length === 0}
            className="mt-1 w-full h-11 rounded-full bg-indigo-600 text-white font-semibold transition active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            확인
          </button>
        </form>
      </div>
    </div>
  );
}