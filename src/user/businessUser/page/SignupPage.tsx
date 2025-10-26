import React, { useMemo, useState } from "react";
import Navbar from "../components/WebHeader";
import Footer from "../components/WebFooter";
import { signup, type Gender } from "../services/auth.services";
import { sendSMS, verifySMS } from "../services/auth.services";

const formatPhone = (v: string) =>
  v
    .replace(/[^\d]/g, "")
    .slice(0, 11)
    .replace(/^(\d{3})(\d{0,4})(\d{0,4})$/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join("-")
    );

const SignupPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState<Gender>("MALE");

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // ✅ 유효성 분리 (디버깅/가독성 좋게)
  const phoneDigits = useMemo(
    () => phoneNumber.replace(/\D/g, ""),
    [phoneNumber]
  );
  const validPhone = phoneDigits.length === 11;       // 한국 휴대폰 11자리 기준
  const validPassword = password.trim().length >= 6;
  const validName = name.trim().length > 0;
  const validNick = nickName.trim().length > 0;

  // ✅ 인증 완료 포함한 최종 유효성
  const isValid = otpVerified && validPhone && validPassword && validName && validNick;

  // ✅ 인증번호 발송
  const requestOTP = async () => {
    setErr(null);
    setMsg(null);
    setIsSendingOtp(true);
    setOtpVerified(false); // 재요청 시 인증 상태 초기화
    try {
      const r = await sendSMS(phoneNumber);
      setOtpSent(true); // ok/maybe 모두 확인 버튼은 활성화
      setMsg(
        r === "ok"
          ? "인증번호를 전송했어요."
          : "전송 제한 또는 이미 발송됨. 문자를 확인해 주세요."
      );
    } catch (e) {
      setOtpSent(true); // 네트워크/래퍼 오류여도 실제로는 발송됐을 수 있으니 버튼은 살림
      setErr("전송 처리에 오류가 있었어요. 문자 수신 여부를 확인해 주세요.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ✅ 인증번호 확인(수동)
  const verifyCodeManually = async () => {
    setErr(null);
    setMsg(null);
    setIsVerifying(true);
    try {
      await verifySMS(phoneNumber, verifyCode);
      setOtpVerified(true);
      setMsg("인증이 완료되었습니다!");
    } catch {
      setOtpVerified(false);
      setErr("인증번호가 일치하지 않습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ 가입 제출
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      setErr("휴대폰 인증을 완료해 주세요.");
      return;
    }
    if (!isValid) {
      setErr("필수 항목을 확인해 주세요.");
      return;
    }

    setErr(null);
    setMsg(null);
    setSubmitting(true);
    try {
      await signup({ name, nickName, password, phoneNumber, gender });
      setMsg("회원가입이 완료되었습니다. 로그인해 주세요!");
      // window.location.href = "/login";
    } catch {
      setErr("회원가입에 실패했어요. 입력 정보를 다시 확인해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  const phonePH = useMemo(() => "010-1111-1111", []);
  const codePH = useMemo(() => "인증번호 입력", []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Navbar />

      <main className="flex-grow mx-auto w-full max-w-md px-5 pt-8 pb-24">
        <button
          type="button"
          onClick={() => history.back()}
          className="inline-flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <span className="text-xl">←</span>
          <span className="sr-only">뒤로가기</span>
        </button>

        <h1 className="mt-4 text-2xl font-bold leading-snug">
          입력한 정보가 맞다면
          <br />아래 확인 버튼을 눌러주세요.
        </h1>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* 휴대폰 번호 */}
          <div>
            <label className="block text-sm font-semibold mb-2">휴대폰 번호</label>
            <div className="flex gap-2">
              <input
                type="tel"
                inputMode="numeric"
                placeholder={phonePH}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhone(e.target.value))}
                className="flex-1 h-11 rounded-lg border border-gray-200 px-3 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={requestOTP}
                disabled={isSendingOtp || !validPhone}
                className="h-11 whitespace-nowrap rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isSendingOtp ? "전송중..." : "인증번호 발급"}
              </button>
            </div>
            {otpSent && (
              <p className="mt-1 text-xs text-blue-600">인증번호가 전송되었습니다.</p>
            )}
          </div>

          {/* 인증번호 */}
          <div>
            <label className="block text-sm font-semibold mb-2">인증번호</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder={codePH}
                value={verifyCode}
                onChange={(e) =>
                  setVerifyCode(e.target.value.replace(/[^\d]/g, "").slice(0, 6))
                }
                className="flex-1 h-11 rounded-lg border border-gray-200 px-3 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />

              {/* 인증번호 확인 버튼 */}
              <button
                type="button"
                onClick={verifyCodeManually}
                disabled={
                  isVerifying ||
                  !validPhone ||         // 11자리 유효 폰 번호
                  verifyCode.length !== 6 ||
                  otpVerified
                }
                className={`h-11 whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-white transition
                  ${otpVerified
                    ? "bg-green-500 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 disabled:opacity-50"}`}
              >
                {otpVerified ? "인증 완료" : isVerifying ? "확인 중..." : "인증번호 확인"}
              </button>
            </div>

            {otpVerified && (
              <p className="mt-1 text-xs text-green-600">휴대폰 인증이 완료되었습니다.</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-semibold mb-2">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-semibold mb-2">이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-semibold mb-2">닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-200 px-3 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-semibold mb-2">성별</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("MALE")}
                className={`h-11 rounded-lg border text-sm font-semibold ${
                  gender === "MALE"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                남
              </button>
              <button
                type="button"
                onClick={() => setGender("FEMALE")}
                className={`h-11 rounded-lg border text-sm font-semibold ${
                  gender === "FEMALE"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-500 border-gray-200"
                }`}
              >
                여
              </button>
            </div>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}
          {msg && <p className="text-sm text-green-600">{msg}</p>}

          {/* 확인(가입) */}
          <button
            type="submit"
            disabled={submitting || !isValid}
            className="mt-2 w-full h-11 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "처리중..." : "확인"}
          </button>

          {/* 개발 중 체크용 (원하면 제거)
          <div className="text-xs text-gray-500 space-y-1 mt-2">
            <div>otpVerified: <b className={otpVerified ? "text-green-600" : "text-red-600"}>{String(otpVerified)}</b></div>
            <div>validPhone(11자리): <b className={validPhone ? "text-green-600" : "text-red-600"}>{String(validPhone)}</b> ({phoneDigits.length})</div>
            <div>validPassword(>=6): <b className={validPassword ? "text-green-600" : "text-red-600"}>{String(validPassword)}</b></div>
            <div>validName: <b className={validName ? "text-green-600" : "text-red-600"}>{String(validName)}</b></div>
            <div>validNick: <b className={validNick ? "text-green-600" : "text-red-600"}>{String(validNick)}</b></div>
          </div>
          */}
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;