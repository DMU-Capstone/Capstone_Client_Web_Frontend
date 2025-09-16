import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { apiGet, errorUtils, tokenUtils } from "../../utils/api";

// API 응답에 맞는 회원 타입 정의 (성별 포함)
interface Member {
  name: string;
  nickName: string;
  phoneNumber: string;
  gender: "MALE" | "FEMALE";
}

// API 응답 타입
interface MemberListResponse {
  content: Member[];
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

const MemberList = () => {
  const [selectedMenu, setSelectedMenu] = useState("사용자 회원");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  // 성별 한글 텍스트 변환
  const getGenderText = (gender: Member["gender"]) => {
    switch (gender) {
      case "MALE":
        return "남성";
      case "FEMALE":
        return "여성";
      default:
        return "알 수 없음";
    }
  };

  // 성별 색상
  const getGenderColor = (gender: Member["gender"]) => {
    switch (gender) {
      case "MALE":
        return "bg-blue-100 text-blue-800";
      case "FEMALE":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = tokenUtils.getToken();
      console.log("사용할 토큰:", token);

      if (!token) {
        throw new Error("로그인이 필요합니다. 다시 로그인해주세요.");
      }

      const endpoint = `/admin/users?page=${currentPage}&size=${pageSize}`;
      console.log("API 요청 엔드포인트:", endpoint);

      const response = await apiGet<MemberListResponse>(endpoint, {
        headers: {
          access: token,
          "Content-Type": "application/json",
        },
      });

      console.log("회원 목록 API 응답:", response);

      if (response.success && response.data) {
        setMembers(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalElements);
      } else {
        throw new Error(
          response.message || "회원 목록을 불러오는데 실패했습니다."
        );
      }
    } catch (err) {
      const errorMessage = errorUtils.getErrorMessage(err);
      setError(errorMessage);
      errorUtils.logError(err, "MemberList");
      console.error("회원 목록 에러:", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 회원 목록 불러오기
  useEffect(() => {
    fetchMembers();
  }, [currentPage]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Header />

      {/* 사이드바 */}
      <div className="fixed top-16 left-0 h-full w-72 bg-white shadow-lg z-40">
        <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 ml-72 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">회원 관리</h2>
            <p className="text-gray-600">
              가입한 사용자들을 관리할 수 있습니다.
            </p>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">전체 회원</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalCount}
                  </p>
                </div>
              </div>
            </div>
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">남성 회원</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {members.filter((m) => m.gender === "MALE").length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">여성 회원</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {members.filter((m) => m.gender === "FEMALE").length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* 회원 목록 테이블 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">로딩 중...</span>
              </div>
            ) : members.length === 0 ? (
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  회원이 없습니다
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  아직 가입한 회원이 없습니다.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 mx-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          이름
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          닉네임
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          전화번호
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          성별
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {members.map((member, index) => (
                        <tr
                          key={`${member.phoneNumber}-${index}`}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                  <svg
                                    className="h-6 w-6 text-gray-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 text-center">
                                  {member.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 text-center">
                              {member.nickName || "-"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 text-center">
                              {member.phoneNumber}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGenderColor(
                                  member.gender
                                )}`}
                              >
                                {getGenderText(member.gender)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
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
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          총 <span className="font-medium">{totalCount}</span>명
                          중{" "}
                          <span className="font-medium">
                            {(currentPage - 1) * pageSize + 1}
                          </span>
                          -
                          <span className="font-medium">
                            {Math.min(currentPage * pageSize, totalCount)}
                          </span>
                          명 표시
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
                            { length: totalPages },
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
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            disabled={currentPage === totalPages}
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

export default MemberList;
