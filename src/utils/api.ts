// API 기본 설정
export const API_BASE_URL = "http://134.185.99.89:8080";

// api respones 타입

export type ResponseDto = {
  page: 0;
  size: 0;
  totalPages: 0;
  totalElements: 0;
};
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
}

// 기본 헤더 설정
const getDefaultHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // 토큰이 있으면 Authorization 헤더 추가
  const token = localStorage.getItem("accessToken");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

// API 요청 함수
export const apiRequest = async <T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> => {
  const { method = "GET", headers = {}, body, timeout = 10000 } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = getDefaultHeaders();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      success: true,
      data,
      headers: response.headers, // 헤더 추가
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("요청 시간이 초과되었습니다.");
      }
      throw error;
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

// GET 요청
export const apiGet = <T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "GET" });

// POST 요청
export const apiPost = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "POST", body });

// PUT 요청
export const apiPut = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "PUT", body });

// DELETE 요청
export const apiDelete = <T = any>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "DELETE" });

// PATCH 요청
export const apiPatch = <T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiRequestOptions, "method" | "body">
) => apiRequest<T>(endpoint, { ...options, method: "PATCH", body });

// 토큰 관리 유틸리티
export const tokenUtils = {
  // 토큰 저장
  setToken: (token: string) => {
    localStorage.setItem("accessToken", token);
  },

  // 토큰 가져오기
  getToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  // 토큰 제거
  removeToken: () => {
    localStorage.removeItem("accessToken");
  },

  // 토큰 유효성 검사
  isTokenValid: (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    try {
      // JWT 토큰의 만료 시간 확인 (간단한 구현)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },
};

// 에러 처리 유틸리티
export const errorUtils = {
  // API 에러 메시지 추출
  getErrorMessage: (error: any): string => {
    if (typeof error === "string") return error;
    if (error?.message) return error.message;
    if (error?.response?.data?.message) return error.response.data.message;
    return "알 수 없는 오류가 발생했습니다.";
  },

  // 에러 로깅
  logError: (error: any, context?: string) => {
    console.error(`[API Error]${context ? ` [${context}]` : ""}:`, error);
  },
};

// API 상태 관리
export const apiStatus = {
  // 로딩 상태 관리
  isLoading: false,

  // 로딩 시작
  startLoading: () => {
    apiStatus.isLoading = true;
  },

  // 로딩 종료
  stopLoading: () => {
    apiStatus.isLoading = false;
  },
};
