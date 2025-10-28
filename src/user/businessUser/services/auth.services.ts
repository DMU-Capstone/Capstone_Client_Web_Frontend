import { apiPost } from "../../../utils/api";
import { AUTH_ENDPOINTS, SMS_ENDPOINTS } from "../../../utils/apiEndpoints";

export type Gender = "MALE" | "FEMALE";

export interface SignupPayload {
  name: string;
  nickName: string;
  password: string;
  phoneNumber: string;
  gender: Gender;
}

/**
 * 인증번호 발송
 * - apiPost는 실패 시 throw 하므로, catch에서 상태코드 판별
 * - 일부 서버는 '이미 발송/쿨다운' 같은 상황에 4xx를 줄 수 있으므로 그런 경우는 "maybe"로 처리
 */
export async function sendSMS(phoneRaw: string): Promise<"ok" | "maybe"> {
  const phoneNum = phoneRaw.replace(/\D/g, "");

  try {
    await apiPost(SMS_ENDPOINTS.SEND, { phoneNum });
    return "ok";
  } catch (err: any) {
    // apiPost 래퍼 형태에 따라 에러 객체에서 상태코드 꺼내기
    const status =
      err?.status ??
      err?.response?.status ??
      err?.code ?? // 래퍼가 code에 넣는 경우
      undefined;

    if (status === 400 || status === 409) {
      // 재발송 제한/이미 발송 등: 실제로는 문자가 갔을 수 있음
      return "maybe";
    }

    // 상태코드를 못 읽어도 사용자 경험을 위해 "maybe"로 완화할 수 있음
    // 필요시 아래 한 줄을 주석 해제/교체하세요.
    // return "maybe";

    throw err;
  }
}

/**
 * 인증번호 확인
 * - 성공 시 조용히 return, 실패면 throw
 */
export async function verifySMS(phoneRaw: string, certificationCode: string): Promise<void> {
  const phoneNum = phoneRaw.replace(/\D/g, "");
  await apiPost(SMS_ENDPOINTS.VERIFY, { phoneNum, certificationCode });
}

/**
 * 회원가입
 */
export async function signup(payload: SignupPayload) {
  const res = await apiPost(AUTH_ENDPOINTS.REGISTER, payload);
  return res.data; // ApiResponse<T>의 data만 사용
}