import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../../utils/api";
import { AUTH_ENDPOINTS } from "../../utils/apiEndpoints";
import { tokenUtils, errorUtils } from "../../utils/api";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user_id: string;
  name: string;
  role: string;
}

// ✅ 휴대폰 하이픈 자동 포맷터 (010-1234-5678)
const formatPhone = (v: string) =>
  v
    .replace(/[^\d]/g, "") // 숫자 외 제거
    .slice(0, 11) // 최대 11자리
    .replace(/^(\d{3})(\d{0,4})(\d{0,4})$/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join("-")
    );

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // ✅ username은 휴대폰처럼 자동 하이픈 포맷
    if (name === "username") {
      setFormData((prev) => ({ ...prev, username: formatPhone(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiPost<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        {
          username: formData.username, // 하이픈 그대로 유지
          password: formData.password,
        } as LoginRequest,
        { headers: { "X-Client-Type": "web" } }
      );

      if (response.success && response.data) {
        // ✅ Authorization 헤더에서 Bearer 토큰 추출
        const authHeader =
          response.headers?.get("authorization") ||
          response.headers?.get("Authorization");

        if (authHeader?.startsWith("Bearer ")) {
          const token = authHeader.substring(7);
          tokenUtils.setToken(token);
          sessionStorage.setItem("accessToken", token);
        }

        // ✅ 명세에 따라 user_id, access_token, refresh_token 저장
        const { user_id, name, role, access_token, refresh_token } =
          response.data;

        if (access_token) {
          sessionStorage.setItem("accessToken", access_token);
        }
        if (refresh_token) {
          sessionStorage.setItem("refreshToken", refresh_token);
        }

        // ✅ 사용자 정보 저장 (명세 반영)
        const userInfo = {
          id: user_id,
          name,
          username: formData.username,
          role,
        };
        sessionStorage.setItem("user", JSON.stringify(userInfo));
        sessionStorage.setItem("user_id", user_id);

        navigate("/");
      } else {
        throw new Error(response.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = errorUtils.getErrorMessage(err);
      setError(errorMessage);
      errorUtils.logError(err, "Login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 및 제목 */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">관리자 로그인</h2>
          <p className="mt-2 text-sm text-gray-600">
            줄서기 어플 관리자 페이지에 로그인하세요
          </p>
        </div>

        {/* 로그인 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-4">
              {/* 아이디(휴대폰) */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  아이디
                </label>
                <input
                  id="username"
                  name="username"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="010-1234-5678"
                />
              </div>

              {/* 비밀번호 */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 버튼들 */}
            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    로그인 중...
                  </div>
                ) : (
                  "로그인"
                )}
              </button>

              <Link
                to="/signup"
                className="inline-flex w-full items-center justify-center py-2 px-4 text-sm font-medium rounded-md border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                회원가입
              </Link>
            </div>

            {/* 추가 옵션 */}
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-700">
                  로그인 상태 유지
                </span>
              </label>

              <div className="text-sm">
                <Link
                  to="/"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>
          </div>
        </form>

        {/* 푸터 */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 줄서기 어플 관리자 페이지. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;