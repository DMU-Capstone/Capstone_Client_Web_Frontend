import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import GuestService, { getQueueDetail } from "../services/GuestService";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../utils/api"; 

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

const FIXED_HOST_ID = 57;
const fallbackImg =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop";

type HostDetail = {
  id: number;
  imgUrl?: string;
  hostName?: string;
  description?: string;
  // 필요하면 스웨거의 다른 필드들도 추가 가능
};

const toAbsolute = (p?: string) =>
  !p ? undefined : p.startsWith("http") ? p : `${API_BASE_URL}${p}`;

export default function GuestScreen() {
  const { register, handleSubmit, formState: { errors } } =
    useForm<FormData>({ resolver: yupResolver(schema) });

  const navigate = useNavigate();

  // 활성화 큐(고정 57만 사용)
  const [activeHosts, setActiveHosts] = useState<ActiveQueue[]>([]);
  const [activeHostId, setActiveHostId] = useState<number | null>(FIXED_HOST_ID);

  // 선택된 대기열 객체
  const selectedHost = useMemo(
    () => activeHosts.find(h => h.id === activeHostId) ?? null,
    [activeHosts, activeHostId]
  );

  const [host, setHost] = useState<HostDetail | null>(null);
  const [hostLoading, setHostLoading] = useState(true);
  const [hostErr, setHostErr] = useState<string | null>(null);

  useEffect(() => {
    const fetchFixedHost = async () => {
      try {
        // 1) 호스트 단건 조회
        setHostLoading(true);
        setHostErr(null);

        const res = await fetch(`${API_BASE_URL}/host/${FIXED_HOST_ID}`, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`호스트 단건조회 실패: ${res.status}`);
        const h = (await res.json()) as HostDetail;
        setHost(h);

        // 2) 대기열 합계 계산 (그대로 유지)
        const details = await getQueueDetail(FIXED_HOST_ID);
        const total = details.reduce(
          (sum: number, item: { count: number }) => sum + item.count,
          0
        );

        // 3) activeHosts/activeHostId 세팅 (제목은 단건조회 값 사용)
        const name = h.hostName || `호스트 #${FIXED_HOST_ID}`;
        setActiveHosts([{ id: FIXED_HOST_ID, name, count: total }]);
        setActiveHostId(FIXED_HOST_ID);
      } catch (err: any) {
        console.error(err);
        setHostErr(err?.message ?? "호스트 정보를 불러오지 못했습니다.");
      } finally {
        setHostLoading(false);
      }
    };

    fetchFixedHost();
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

      // 등록 후 최신 대기 인원 갱신
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
          {/* ✅ 선택된 대기열 표시 (고정 57) */}
          <div className="mt-4">
            {hostErr && (
              <div className="mb-3 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700">
                {hostErr}
              </div>
            )}

            {hostLoading ? (
              <div className="h-24 rounded-lg bg-gray-100 animate-pulse" />
            ) : host ? (
              <div className="flex gap-3 items-start">
                <div className="w-[88px] h-[88px] rounded-lg border border-gray-200 overflow-hidden shrink-0 bg-white">
                  <img
                    src={toAbsolute(host.imgUrl) ?? fallbackImg}
                    alt={host.hostName ?? "호스트 이미지"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-base font-bold truncate">
                    {host.hostName ?? `호스트 #${FIXED_HOST_ID}`}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 whitespace-pre-line line-clamp-3">
                    {host.description?.trim() || "소개 정보가 없습니다."}
                  </p>
                </div>
              </div>
            ) : null}
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
            disabled={!activeHostId}
            className="mt-1 w-full h-11 rounded-full bg-indigo-600 text-white font-semibold transition active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            확인
          </button>
        </form>
      </div>
    </div>
  );
}