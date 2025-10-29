export const API_BASE_URL = "http://134.185.99.89:8080";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  headers?: Headers;
}

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;                   // FormData 가능
  timeout?: number;
  credentials?: RequestCredentials; // 필요 시 'include'
}

// ──────────────────────────────────────────────
// 토큰 보관/가져오기(세션 우선 → 로컬)
const getToken = (): string | null =>
  sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");

export const tokenUtils = {
  setTokenFromAuthHeader: (authHeader?: string | null) => {
    if (!authHeader) return;
    // "Bearer x.y.z" → "x.y.z"
    const m = authHeader.match(/^Bearer\s+(.+)$/i);
    const token = m ? m[1] : authHeader;
    sessionStorage.setItem("accessToken", token);
    localStorage.setItem("accessToken", token);
  },
  setToken: (rawToken: string) => {
    sessionStorage.setItem("accessToken", rawToken);
    localStorage.setItem("accessToken", rawToken);
  },
  getToken,
  clear: () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
  },
};

// 포스트맨과 동일한 형태의 공통 헤더 생성
const buildHeaders = (body?: any, extra?: Record<string, string>) => {
  const headers: Record<string, string> = { Accept: "application/json" };

  // access 헤더 붙이기(포스트맨과 동일)
  const access = getToken();
  if (access) headers["access"] = access;

  // FormData가 아닐 때만 Content-Type 지정
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;
  if (!isForm) headers["Content-Type"] = "application/json";

  // (선택) Authorization도 같이 보내고 싶다면 아래 주석 해제
  // if (access) headers["Authorization"] = `Bearer ${access}`;

  return { ...headers, ...(extra || {}) };
};

// 공통 요청
export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = "GET",
    headers: customHeaders,
    body,
    timeout = 10000,
    credentials, // 필요 시 'include'
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method,
      headers: buildHeaders(body, customHeaders),
      body: isForm ? (body as FormData) : body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      // refresh 쿠키를 쓰는 엔드포인트에서 필요하면 주석 해제
      // credentials: credentials ?? "include",
      credentials: credentials ?? "same-origin",
    });

    clearTimeout(t);

    // 로그인/갱신 응답에 Authorization이 오면 저장
    const authHeader = res.headers.get("authorization");
    if (authHeader) tokenUtils.setTokenFromAuthHeader(authHeader);

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json().catch(() => undefined) : undefined;

    if (!res.ok) {
      // 만료 등 401 → 토큰 삭제 및 메시지 반환
      if (res.status === 401) {
        tokenUtils.clear();
      }
      return {
        success: false,
        message:
          (payload && (payload.message || payload.error)) ||
          `HTTP ${res.status}: ${res.statusText}`,
        headers: res.headers,
      };
    }

    return { success: true, data: payload as T, headers: res.headers };
  } catch (e: any) {
    clearTimeout(t);
    const msg = e?.name === "AbortError" ? "요청 시간이 초과되었습니다." : e?.message || "알 수 없는 오류가 발생했습니다.";
    return { success: false, message: msg };
  }
};

// sugar helpers
export const apiGet = <T = any>(endpoint: string, opt?: Omit<ApiRequestOptions, "method" | "body">) =>
  apiRequest<T>(endpoint, { ...opt, method: "GET" });

export const apiPost = <T = any>(endpoint: string, body?: any, opt?: Omit<ApiRequestOptions, "method">) =>
  apiRequest<T>(endpoint, { ...opt, method: "POST", body });

export const apiPut = <T = any>(endpoint: string, body?: any, opt?: Omit<ApiRequestOptions, "method">) =>
  apiRequest<T>(endpoint, { ...opt, method: "PUT", body });

export const apiDelete = <T = any>(endpoint: string, opt?: Omit<ApiRequestOptions, "method" | "body">) =>
  apiRequest<T>(endpoint, { ...opt, method: "DELETE" });

export const apiPatch = <T = any>(endpoint: string, body?: any, opt?: Omit<ApiRequestOptions, "method">) =>
  apiRequest<T>(endpoint, { ...opt, method: "PATCH", body });

// 에러 로깅 헬퍼(선택)
export const errorUtils = {
  getErrorMessage: (err: any) =>
    typeof err === "string"
      ? err
      : err?.message || err?.response?.data?.message || "알 수 없는 오류가 발생했습니다.",
  logError: (err: any, ctx?: string) => console.error(`[API Error]${ctx ? ` [${ctx}]` : ""}`, err),
};