// API 기본 설정
export const API_BASE_URL = "http://134.185.99.89:8080";

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  headers?: Headers; // 헤더 추가
}

// API 에러 타입 정의
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// HTTP 메서드 타입
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// API 요청 옵션 타입
export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  credentials?: RequestCredentials; // 필요 시 쿠키 사용
}

// ──────────────────────────────────────────────────────────────
// 토큰 가져오기: sessionStorage 우선, 없으면 localStorage
const getAuthToken = (): string | null =>
  sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken") || null;

// 기본 헤더(공통). ⚠️ 여기서는 Content-Type을 넣지 않음!
const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = getAuthToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// API 요청 함수
export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const {
    method = "GET",
    headers: customHeaders = {},
    body,
    timeout = 10000,
    credentials, // 필요 시 "include"
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = getDefaultHeaders();

  // FormData 여부 판단
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  // 최종 헤더 구성
  const headers: Record<string, string> = { ...defaultHeaders, ...customHeaders };

  // ✨ FormData면 Content-Type을 절대 수동 지정하지 말 것!
  if (isFormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  } else if (body !== undefined && body !== null) {
    // JSON 바디일 때만 설정
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: isFormData
        ? (body as FormData)
        : body !== undefined && body !== null
        ? JSON.stringify(body)
        : undefined,
      signal: controller.signal,
      credentials, // 필요하면 { credentials: "include" } 로 호출
    });

    clearTimeout(timeoutId);

    // 204 등 비어있는 응답 처리
    const contentType = response.headers.get("content-type") || "";
    const hasJson = contentType.includes("application/json");

    if (!response.ok) {
      let message = `HTTP ${response.status}: ${response.statusText}`;
      if (hasJson) {
        const errorData = await response.json().catch(() => ({} as any));
        message = errorData?.message || message;
      } else {
        const text = await response.text().catch(() => "");
        if (text) message = text;
      }
      throw new Error(message);
    }

    const data = hasJson ? await response.json() : (undefined as any);

    return {
      success: true,
      data,
      headers: response.headers,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { success: false, message: "요청 시간이 초과되었습니다." };
      }
      return { success: false, message: error.message };
    }

    return { success: false, message: "알 수 없는 오류가 발생했습니다." };
  }
};

// 편의 메서드들
export const apiGet = <T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "GET" });

export const apiPost = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "POST", body });

export const apiPut = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "PUT", body });

export const apiDelete = <T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "DELETE" });

export const apiPatch = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "PATCH", body });

// 토큰 유틸
export const tokenUtils = {
  setToken: (token: string) => {
    sessionStorage.setItem("accessToken", token); // 로그인 로직과 일치
    localStorage.setItem("accessToken", token);    // (선택) 양쪽 저장
  },
  getToken: (): string | null => getAuthToken(),
  removeToken: () => {
    sessionStorage.removeItem("accessToken");
    localStorage.removeItem("accessToken");
  },
  isTokenValid: (): boolean => {
    const token = getAuthToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },
};

// 에러 유틸
export const errorUtils = {
  getErrorMessage: (error: any): string => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return "알 수 없는 오류가 발생했습니다.";
  },
  logError: (error: any, context?: string) => {
    console.error(`[API Error]${context ? ` [${context}]` : ""}:`, error);
  },
};

// API 상태(옵셔널)
export const apiStatus = {
  isLoading: false,
  startLoading: () => (apiStatus.isLoading = true),
  stopLoading: () => (apiStatus.isLoading = false),
};