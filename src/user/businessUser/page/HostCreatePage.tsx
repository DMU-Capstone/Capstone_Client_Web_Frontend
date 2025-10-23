import React from "react";
import { useForm } from "react-hook-form";
import { createHost, filesToBase64 } from "../../../utils/services/host.services";
import type { CreateHostRequest } from "../../../utils/types/host.types";

type HostFormValues = {
  hostName: string;
  maxPeople: number | string;
  ownerName: string;
  phone: string;
  lat: number;
  lng: number;
  keywords: string[];
  about: string;
  openTime?: string;
  closeTime?: string;
  photos?: File[];
};

const toIso = (t: string | undefined, fb: string) => {
  const today = new Date().toISOString().slice(0, 10);
  return new Date(`${today}T${(t && t.trim()) || fb}:00`).toISOString();
};

export default function HostCreatePage() {
  const { register, handleSubmit, reset } = useForm<HostFormValues>();

  const onSubmit = async (values: HostFormValues) => {
    const payload: CreateHostRequest = {
      request: {
        hostName: values.hostName,
        maxPeople: Number(values.maxPeople),
        hostManagerName: values.ownerName,
        hostPhoneNumber: values.phone,
        latitude: values.lat,
        longitude: values.lng,
        keyword: values.keywords.join(","),
        description: values.about,
        startTime: toIso(values.openTime, "09:00"),
        endTime: toIso(values.closeTime, "18:00"),
      },
      hostImages: await filesToBase64(values.photos ?? []),
    };

    await createHost(payload);
    alert("호스트 생성 완료!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-4 space-y-4">
      <input {...register("hostName")} placeholder="가게 이름" className="border px-3 py-2 w-full rounded" />
      <input {...register("maxPeople")} placeholder="최대 인원" className="border px-3 py-2 w-full rounded" />
      <input {...register("ownerName")} placeholder="대표자 이름" className="border px-3 py-2 w-full rounded" />
      <input {...register("phone")} placeholder="전화번호" className="border px-3 py-2 w-full rounded" />
      <input type="number" step="0.000001" {...register("lat")} placeholder="위도" className="border px-3 py-2 w-full rounded" />
      <input type="number" step="0.000001" {...register("lng")} placeholder="경도" className="border px-3 py-2 w-full rounded" />
      {/* 키워드/시간/파일 업로드는 프로젝트 UI에 맞게 구현 */}
      <button type="submit" className="bg-indigo-600 text-white rounded px-4 py-2">대기열 생성</button>
    </form>
  );
}