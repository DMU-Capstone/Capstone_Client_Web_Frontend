import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { errorUtils, tokenUtils } from "../../utils/api";

// API 명세에 맞는 배너 타입 정의
interface Banner {
  id: number;
  imgPath: string;
  createdAt: string;
}

// 배너 목록 응답 타입
interface BannerListResponse {
  content: Banner[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

const MainBanner = () => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("메인 배너");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 배너 목록 조회
  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError("");

      const token = tokenUtils.getToken();
      if (!token) {
        setError("로그인이 필요합니다.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      console.log("토큰 확인:", token);

      // API 명세에 맞게 page 파라미터 수정 (1부터 시작)
      const response = await fetch(
        `http://134.185.99.89:8080/admin/event?page=${currentPage}&size=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            access: token,
          },
        }
      );

      console.log("응답 상태:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("에러 응답:", errorText);

        if (response.status === 401) {
          setError("토큰이 만료되었습니다. 다시 로그인해주세요.");
          tokenUtils.removeToken();
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        if (response.status === 500) {
          setError("서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return;
      }

      const data: BannerListResponse = await response.json();
      console.log("응답 데이터:", data);
      setBanners(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("에러 상세:", err);
      setError(errorUtils.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [currentPage]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />

      <div className="flex-1 p-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            메인 배너 관리
          </h1>
          <p className="text-gray-600">
            앱 메인 화면에 표시될 배너를 관리합니다.
          </p>
        </div>

        {/* 액션 바 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* 검색 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="배너 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* 새로고침 버튼 */}
            <button
              onClick={fetchBanners}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              새로고침
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* 배너 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">배너 목록을 불러오는 중...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                배너가 없습니다
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                현재 등록된 배너가 없습니다.
              </p>
            </div>
          ) : (
            <>
              {/* 테이블 헤더 */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-4">이미지</div>
                  <div className="col-span-3">파일 경로</div>
                  <div className="col-span-4">생성일</div>
                </div>
              </div>

              {/* 배너 목록 */}
              <div className="divide-y divide-gray-200">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* ID */}
                      <div className="col-span-1">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {banner.id}
                        </span>
                      </div>

                      {/* 이미지 */}
                      <div className="col-span-4">
                        <div className="w-32 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={`http://134.185.99.89:8080${banner.imgPath}`}
                            alt={`배너 ${banner.id}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-image.png";
                            }}
                          />
                        </div>
                      </div>

                      {/* 파일 경로 */}
                      <div className="col-span-3">
                        <p className="text-sm text-gray-600 truncate">
                          {banner.imgPath}
                        </p>
                      </div>

                      {/* 생성일 */}
                      <div className="col-span-4">
                        <span className="text-sm text-gray-500">
                          {new Date(banner.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      총 {banners.length}개의 배너
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        이전
                      </button>
                      <span className="px-3 py-1 text-sm text-gray-700">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
