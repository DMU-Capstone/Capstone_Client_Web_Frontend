// 인증 관련 엔드포인트
export const AUTH_ENDPOINTS = {
  LOGIN: "/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
} as const;

// 관리자 관련 엔드포인트
export const ADMIN_ENDPOINTS = {
  DASHBOARD: "/admin/dashboard",
  MEMBERS: "/admin/users",
  MEMBER_DETAIL: (id: string) => `/admin/users/${id}`,
  QUEUE_LIST: "/admin/queue",
  QUEUE_DETAIL: (id: string) => `/admin/queue/${id}`,
  ADS: "/admin/ads",
  AD_DETAIL: (id: string) => `/admin/ads/${id}`,
  STATISTICS: "/admin/statistics",
  SETTINGS: "/admin/settings",
} as const;

// 사용자 관련 엔드포인트
export const USER_ENDPOINTS = {
  PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  QUEUE_JOIN: "/user/queue/join",
  QUEUE_LEAVE: "/user/queue/leave",
  QUEUE_STATUS: "/user/queue/status",
  NOTIFICATIONS: "/user/notifications",
  HISTORY: "/user/history",
} as const;

// 대기열 관련 엔드포인트
export const QUEUE_ENDPOINTS = {
  LIST: "/queue",
  CREATE: "/queue",
  DETAIL: (id: string) => `/queue/${id}`,
  UPDATE: (id: string) => `/queue/${id}`,
  DELETE: (id: string) => `/queue/${id}`,
  JOIN: (id: string) => `/queue/${id}/join`,
  LEAVE: (id: string) => `/queue/${id}/leave`,
  STATUS: (id: string) => `/queue/${id}/status`,
  NEXT: (id: string) => `/queue/${id}/next`,
} as const;

// 광고 관련 엔드포인트
export const AD_ENDPOINTS = {
  LIST: "/ads",
  CREATE: "/ads",
  DETAIL: (id: string) => `/ads/${id}`,
  UPDATE: (id: string) => `/ads/${id}`,
  DELETE: (id: string) => `/ads/${id}`,
  UPLOAD_IMAGE: "/ads/upload",
} as const;

// 파일 업로드 관련 엔드포인트
export const UPLOAD_ENDPOINTS = {
  IMAGE: "/upload/image",
  DOCUMENT: "/upload/document",
  AVATAR: "/upload/avatar",
} as const;

// 알림 관련 엔드포인트
export const NOTIFICATION_ENDPOINTS = {
  LIST: "/notifications",
  MARK_READ: (id: string) => `/notifications/${id}/read`,
  MARK_ALL_READ: "/notifications/read-all",
  DELETE: (id: string) => `/notifications/${id}`,
} as const;

// 통계 관련 엔드포인트
export const STATISTICS_ENDPOINTS = {
  DASHBOARD: "/statistics/dashboard",
  USERS: "/statistics/users",
  QUEUE: "/statistics/queue",
  ADS: "/statistics/ads",
  REVENUE: "/statistics/revenue",
} as const;

// 설정 관련 엔드포인트
export const SETTINGS_ENDPOINTS = {
  GENERAL: "/settings/general",
  NOTIFICATION: "/settings/notification",
  SECURITY: "/settings/security",
  PRIVACY: "/settings/privacy",
} as const;

export const HOST_ENDPOINTS = {
  CREATE: "/host",
} as const;

// 모든 엔드포인트를 하나의 객체로 통합
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  ADMIN: ADMIN_ENDPOINTS,
  USER: USER_ENDPOINTS,
  QUEUE: QUEUE_ENDPOINTS,
  AD: AD_ENDPOINTS,
  UPLOAD: UPLOAD_ENDPOINTS,
  NOTIFICATION: NOTIFICATION_ENDPOINTS,
  STATISTICS: STATISTICS_ENDPOINTS,
  SETTINGS: SETTINGS_ENDPOINTS,
  HOST: HOST_ENDPOINTS,
} as const;

// 엔드포인트 타입 정의
export type AuthEndpoint = (typeof AUTH_ENDPOINTS)[keyof typeof AUTH_ENDPOINTS];
export type AdminEndpoint =
  (typeof ADMIN_ENDPOINTS)[keyof typeof ADMIN_ENDPOINTS];
export type UserEndpoint = (typeof USER_ENDPOINTS)[keyof typeof USER_ENDPOINTS];
export type QueueEndpoint =
  (typeof QUEUE_ENDPOINTS)[keyof typeof QUEUE_ENDPOINTS];
export type AdEndpoint = (typeof AD_ENDPOINTS)[keyof typeof AD_ENDPOINTS];
export type UploadEndpoint =
  (typeof UPLOAD_ENDPOINTS)[keyof typeof UPLOAD_ENDPOINTS];
export type NotificationEndpoint =
  (typeof NOTIFICATION_ENDPOINTS)[keyof typeof NOTIFICATION_ENDPOINTS];
export type StatisticsEndpoint =
  (typeof STATISTICS_ENDPOINTS)[keyof typeof STATISTICS_ENDPOINTS];
export type SettingsEndpoint =
  (typeof SETTINGS_ENDPOINTS)[keyof typeof SETTINGS_ENDPOINTS];
