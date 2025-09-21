import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// 매장 타입 정의
interface Store {
  id: number;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  storeDescription: string;
  storeCategory: string;
  storeStatus: "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
}

const StoreList = () => {
  const [selectedMenu, setSelectedMenu] = useState("매장목록");
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // 샘플 데이터
  const sampleStores: Store[] = [
    {
      id: 1,
      storeName: "스타벅스 강남점",
      storeAddress: "서울시 강남구 테헤란로 123",
      storePhone: "02-1234-5678",
      storeDescription: "강남 중심가에 위치한 스타벅스 매장입니다.",
      storeCategory: "CAFE",
      storeStatus: "ACTIVE",
      ownerName: "김철수",
      ownerPhone: "010-1234-5678",
      createdAt: "2024-01-15T09:00:00Z",
      updatedAt: "2024-01-15T09:00:00Z",
    },
    {
      id: 2,
      storeName: "맥도날드 홍대점",
      storeAddress: "서울시 마포구 홍익로 456",
      storePhone: "02-2345-6789",
      storeDescription: "홍대 상권의 맥도날드 매장입니다.",
      storeCategory: "RESTAURANT",
      storeStatus: "ACTIVE",
      ownerName: "이영희",
      ownerPhone: "010-2345-6789",
      createdAt: "2024-01-20T10:30:00Z",
      updatedAt: "2024-01-20T10:30:00Z",
    },
    {
      id: 3,
      storeName: "파리바게뜨 신촌점",
      storeAddress: "서울시 서대문구 신촌로 789",
      storePhone: "02-3456-7890",
      storeDescription: "신촌 대학가의 파리바게뜨 매장입니다.",
      storeCategory: "BAKERY",
      storeStatus: "PENDING",
      ownerName: "박민수",
      ownerPhone: "010-3456-7890",
      createdAt: "2024-02-01T14:15:00Z",
      updatedAt: "2024-02-01T14:15:00Z",
    },
    {
      id: 4,
      storeName: "CU 편의점 이대점",
      storeAddress: "서울시 서대문구 이화여대길 101",
      storePhone: "02-4567-8901",
      storeDescription: "이화여대 근처 CU 편의점입니다.",
      storeCategory: "CONVENIENCE",
      storeStatus: "ACTIVE",
      ownerName: "정수진",
      ownerPhone: "010-4567-8901",
      createdAt: "2024-02-05T11:20:00Z",
      updatedAt: "2024-02-05T11:20:00Z",
    },
    {
      id: 5,
      storeName: "올리브영 명동점",
      storeAddress: "서울시 중구 명동길 202",
      storePhone: "02-5678-9012",
      storeDescription: "명동 관광지의 올리브영 매장입니다.",
      storeCategory: "PHARMACY",
      storeStatus: "SUSPENDED",
      ownerName: "최지영",
      ownerPhone: "010-5678-9012",
      createdAt: "2024-02-10T16:45:00Z",
      updatedAt: "2024-02-10T16:45:00Z",
    },
    {
      id: 6,
      storeName: "헤어살롱 청담점",
      storeAddress: "서울시 강남구 청담동 303",
      storePhone: "02-6789-0123",
      storeDescription: "청담동 고급 헤어살롱입니다.",
      storeCategory: "BEAUTY",
      storeStatus: "ACTIVE",
      ownerName: "한미영",
      ownerPhone: "010-6789-0123",
      createdAt: "2024-02-15T13:30:00Z",
      updatedAt: "2024-02-15T13:30:00Z",
    },
    {
      id: 7,
      storeName: "투썸플레이스 압구정점",
      storeAddress: "서울시 강남구 압구정로 404",
      storePhone: "02-7890-1234",
      storeDescription: "압구정 로데오의 투썸플레이스입니다.",
      storeCategory: "CAFE",
      storeStatus: "INACTIVE",
      ownerName: "윤태호",
      ownerPhone: "010-7890-1234",
      createdAt: "2024-02-20T09:15:00Z",
      updatedAt: "2024-02-20T09:15:00Z",
    },
    {
      id: 8,
      storeName: "롯데리아 잠실점",
      storeAddress: "서울시 송파구 올림픽로 505",
      storePhone: "02-8901-2345",
      storeDescription: "잠실 롯데월드몰의 롯데리아입니다.",
      storeCategory: "RESTAURANT",
      storeStatus: "ACTIVE",
      ownerName: "강동훈",
      ownerPhone: "010-8901-2345",
      createdAt: "2024-02-25T12:00:00Z",
      updatedAt: "2024-02-25T12:00:00Z",
    },
  ];

  // 매장 상태 한글 텍스트 변환
  const getStatusText = (status: Store["storeStatus"]) => {
    switch (status) {
      case "ACTIVE":
        return "운영중";
      case "INACTIVE":
        return "휴업";
      case "PENDING":
        return "승인대기";
      case "SUSPENDED":
        return "정지";
      default:
        return "알 수 없음";
    }
  };

  // 매장 상태 색상
  const getStatusColor = (status: Store["storeStatus"]) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 매장 카테고리 한글 변환
  const getCategoryText = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      CAFE: "카페",
      RESTAURANT: "식당",
      BAKERY: "베이커리",
      CONVENIENCE: "편의점",
      PHARMACY: "약국",
      BEAUTY: "미용실",
      ETC: "기타",
    };
    return categoryMap[category] || category;
  };

  const loadStores = () => {
    setLoading(true);
    setTimeout(() => {
      setStores(sampleStores);
      setTotalCount(sampleStores.length);
      setTotalPages(Math.ceil(sampleStores.length / pageSize));
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadStores();
  }, []);

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.storeAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || store.storeStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageStores = filteredStores.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Header />

      <div className="fixed top-16 left-0 h-full w-72 bg-white shadow-lg z-40">
        <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
      </div>

      <div className="flex-1 ml-72 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">매장 관리</h2>
            <p className="text-gray-600">등록된 매장들을 관리할 수 있습니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">전체 매장</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCount}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">운영중</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stores.filter((s) => s.storeStatus === "ACTIVE").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">승인대기</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stores.filter((s) => s.storeStatus === "PENDING").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">정지</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stores.filter((s) => s.storeStatus === "SUSPENDED").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  검색
                </label>
                <div className="relative">
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
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="매장명, 주소, 사장명으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  상태 필터
                </label>
                <select
                  id="status"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">전체</option>
                  <option value="ACTIVE">운영중</option>
                  <option value="PENDING">승인대기</option>
                  <option value="INACTIVE">휴업</option>
                  <option value="SUSPENDED">정지</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadStores}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  새로고침
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">로딩 중...</span>
              </div>
            ) : currentPageStores.length === 0 ? (
              <div className="text-center py-12">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  매장이 없습니다
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== "ALL"
                    ? "검색 조건에 맞는 매장이 없습니다."
                    : "아직 등록된 매장이 없습니다."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          매장 정보
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          카테고리
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          상태
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          사장 정보
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          등록일
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          관리
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPageStores.map((store) => (
                        <tr key={store.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <svg
                                    className="h-6 w-6 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {store.storeName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {store.storeAddress}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {store.storePhone}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {getCategoryText(store.storeCategory)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                store.storeStatus
                              )}`}
                            >
                              {getStatusText(store.storeStatus)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {store.ownerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {store.ownerPhone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(store.createdAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                상세
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                수정
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                삭제
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {Math.ceil(filteredStores.length / pageSize) > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        이전
                      </button>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(
                              prev + 1,
                              Math.ceil(filteredStores.length / pageSize)
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(filteredStores.length / pageSize)
                        }
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          총{" "}
                          <span className="font-medium">
                            {filteredStores.length}
                          </span>
                          개 중{" "}
                          <span className="font-medium">{startIndex + 1}</span>-
                          <span className="font-medium">
                            {Math.min(endIndex, filteredStores.length)}
                          </span>
                          개 표시
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            이전
                          </button>
                          {Array.from(
                            {
                              length: Math.ceil(
                                filteredStores.length / pageSize
                              ),
                            },
                            (_, i) => i + 1
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                page === currentPage
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(
                                  prev + 1,
                                  Math.ceil(filteredStores.length / pageSize)
                                )
                              )
                            }
                            disabled={
                              currentPage ===
                              Math.ceil(filteredStores.length / pageSize)
                            }
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            다음
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreList;
