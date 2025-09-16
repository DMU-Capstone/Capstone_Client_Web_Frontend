import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../../utils/api";
import { AUTH_ENDPOINTS } from "../../utils/apiEndpoints";
import { tokenUtils, errorUtils } from "../../utils/api";

// 로그인 요청 타입 정의
interface LoginRequest {
  username: string;
  password: string;
}
interface LoginResponse {
  message: string;
  username: string;
  name: string;
  role: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 로그인 API 호출 (헤더 포함)
      const response = await apiPost<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        formData as LoginRequest,
        {
          headers: {
            "X-Client-Type": "web",
          },
        }
      );

      console.log("로그인 API 응답:", response);
      console.log("응답 헤더:", response.headers);

      if (response.success && response.data) {
        const authHeader =
          response.headers?.get("authorization") ||
          response.headers?.get("Authorization");

        console.log("Authorization 헤더:", authHeader);

        if (authHeader && authHeader.startsWith("Bearer ")) {
          // Bearer 토큰에서 실제 JWT 토큰 추출
          const token = authHeader.substring(7); // "Bearer " 제거

          // 토큰 저장
          tokenUtils.setToken(token);
          sessionStorage.setItem("accessToken", token);

          console.log("JWT 토큰 저장 완료:", token);
          console.log(
            "Session Storage 확인:",
            sessionStorage.getItem("accessToken")
          );
        } else {
          console.warn("Authorization 헤더에서 토큰을 찾을 수 없습니다.");
          console.log("모든 헤더:", response.headers);

          // 헤더를 객체로 변환해서 확인
          const headersObj: Record<string, string> = {};
          response.headers?.forEach((value, key) => {
            headersObj[key] = value;
          });
          console.log("헤더 객체:", headersObj);
        }

        // 사용자 정보 저장
        const userInfo = {
          id: response.data.username,
          name: response.data.name,
          username: response.data.username,
          role: response.data.role,
        };

        sessionStorage.setItem("user", JSON.stringify(userInfo));
        console.log("사용자 정보 저장 완료:", userInfo);

        console.log("로그인 성공:", response.data);

        // 성공 시 대시보드로 이동
        navigate("/admin/dashboard");
      } else {
        throw new Error(response.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      const errorMessage = errorUtils.getErrorMessage(err);
      setError(errorMessage);
      errorUtils.logError(err, "Login");
      console.error("로그인 에러:", err);
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            관리자 로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            줄서기 어플 관리자 페이지에 로그인하세요
          </p>
        </div>

        {/* 로그인 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
            <div className="space-y-4">
              {/* 아이디 입력 */}
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
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="아이디를 입력하세요"
                />
              </div>

              {/* 비밀번호 입력 */}
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

            {/* 로그인 버튼 */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
            </div>

            {/* 추가 옵션 */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  로그인 상태 유지
                </label>
              </div>

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

        {/* 푸터 정보 */}
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
