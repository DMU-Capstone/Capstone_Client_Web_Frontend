import { apiPost } from "../api"; // 사용 중인 파일 경로에 맞춰 import
import { HOST_ENDPOINTS } from "../apiEndpoints"; // 위 1)에서 만든 경우
import type { CreateHostRequest, CreateHostResponse } from "../types/host.types";

export type ISODateTime = string;

// 파일 -> base64 유틸도 export 되어 있어야 합니다.
export const fileToBase64 = (f: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(f);
  });

export const filesToBase64 = (files: File[]) => Promise.all(files.map(fileToBase64));

export const createHost = async (payload: CreateHostRequest) => {
  // fetch 유틸의 apiPost는 JSON으로 전송하므로 그대로 사용
  const res = await apiPost<CreateHostResponse>(HOST_ENDPOINTS.CREATE, payload);
  if (!res.success) {
    throw new Error(res.message || "호스트 생성 실패");
  }
  return res.data;
};

export function getCurrentUserId(): string | null {
  try {
    const raw = sessionStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);

    // 프로젝트마다 저장 키가 다를 수 있어 가능한 후보를 모두 확인
    const cand =
      u?.storeId ?? u?.id ?? u?.userId ?? u?.adminId ?? u?.username ?? null;

    return cand != null ? String(cand) : null;
  } catch {
    return null;
  }
}