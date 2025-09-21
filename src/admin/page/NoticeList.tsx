import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

// 공지사항 타입 정의
interface Notice {
  id: number;
  title: string;
  content: string;
  author: string;
  isImportant: boolean;
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const NoticeList = () => {
  const [selectedMenu, setSelectedMenu] = useState("공지사항");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [importanceFilter, setImportanceFilter] = useState<
    "ALL" | "IMPORTANT" | "NORMAL"
  >("ALL");

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isImportant: false,
    isActive: true,
  });

  // 샘플 데이터
  const sampleNotices: Notice[] = [
    {
      id: 1,
      title: "시스템 점검 안내",
      content: "2024년 1월 15일 오전 2시부터 4시까지 시스템 점검이 진행됩니다.",
      author: "관리자",
      isImportant: true,
      isActive: true,
      viewCount: 1250,
      createdAt: "2024-01-10T09:00:00Z",
      updatedAt: "2024-01-10T09:00:00Z",
    },
    {
      id: 2,
      title: "새로운 기능 업데이트",
      content:
        "앱에 새로운 기능이 추가되었습니다. 자세한 내용은 업데이트 노트를 확인해주세요.",
      author: "관리자",
      isImportant: false,
      isActive: true,
      viewCount: 890,
      createdAt: "2024-01-08T14:30:00Z",
      updatedAt: "2024-01-08T14:30:00Z",
    },
    {
      id: 3,
      title: "이용약관 변경 안내",
      content:
        "서비스 이용약관이 변경되었습니다. 새로운 약관은 2024년 2월 1일부터 적용됩니다.",
      author: "관리자",
      isImportant: true,
      isActive: false,
      viewCount: 567,
      createdAt: "2024-01-05T11:20:00Z",
      updatedAt: "2024-01-05T11:20:00Z",
    },
    {
      id: 4,
      title: "서비스 이용 시간 변경",
      content:
        "매장 운영 시간이 변경되었습니다. 자세한 내용은 각 매장별로 확인해주세요.",
      author: "관리자",
      isImportant: false,
      isActive: true,
      viewCount: 432,
      createdAt: "2024-01-03T16:45:00Z",
      updatedAt: "2024-01-03T16:45:00Z",
    },
    {
      id: 5,
      title: "결제 시스템 업데이트",
      content: "더욱 안전하고 편리한 결제 시스템으로 업데이트되었습니다.",
      author: "관리자",
      isImportant: true,
      isActive: true,
      viewCount: 789,
      createdAt: "2024-01-01T10:00:00Z",
      updatedAt: "2024-01-01T10:00:00Z",
    },
  ];

  // 데이터 로드 시뮬레이션
  const loadNotices = () => {
    setLoading(true);
    setTimeout(() => {
      setNotices(sampleNotices);
      setTotalPages(Math.ceil(sampleNotices.length / 10));
      setLoading(false);
    }, 500);
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadNotices();
  }, []);

  // 공지사항 생성
  const handleCreateNotice = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const newNotice: Notice = {
      id: Math.max(...notices.map((n) => n.id)) + 1,
      title: formData.title,
      content: formData.content,
      author: "관리자",
      isImportant: formData.isImportant,
      isActive: formData.isActive,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setNotices([newNotice, ...notices]);
    setFormData({ title: "", content: "", isImportant: false, isActive: true });
    setShowCreateModal(false);
    setError("");
  };

  // 공지사항 수정
  const handleEditNotice = () => {
    if (!selectedNotice || !formData.title.trim() || !formData.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const updatedNotices = notices.map((notice) =>
      notice.id === selectedNotice.id
        ? {
            ...notice,
            title: formData.title,
            content: formData.content,
            isImportant: formData.isImportant,
            isActive: formData.isActive,
            updatedAt: new Date().toISOString(),
          }
        : notice
    );

    setNotices(updatedNotices);
    setShowEditModal(false);
    setSelectedNotice(null);
    setFormData({ title: "", content: "", isImportant: false, isActive: true });
    setError("");
  };

  // 공지사항 삭제
  const handleDeleteNotice = () => {
    if (!selectedNotice) return;

    const updatedNotices = notices.filter(
      (notice) => notice.id !== selectedNotice.id
    );
    setNotices(updatedNotices);
    setShowDeleteModal(false);
    setSelectedNotice(null);
    setError("");
  };

  // 수정 모달 열기
  const openEditModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      isImportant: notice.isImportant,
      isActive: notice.isActive,
    });
    setShowEditModal(true);
  };

  // 삭제 모달 열기
  const openDeleteModal = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowDeleteModal(true);
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && notice.isActive) ||
      (statusFilter === "INACTIVE" && !notice.isActive);
    const matchesImportance =
      importanceFilter === "ALL" ||
      (importanceFilter === "IMPORTANT" && notice.isImportant) ||
      (importanceFilter === "NORMAL" && !notice.isImportant);

    return matchesSearch && matchesStatus && matchesImportance;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />

      <div className="flex-1 p-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            공지사항 관리
          </h1>
          <p className="text-gray-600">
            사용자에게 전달할 공지사항을 관리합니다.
          </p>
        </div>

        {/* 액션 바 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* 검색 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="공지사항 검색..."
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

              {/* 상태 필터 */}
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "ALL" | "ACTIVE" | "INACTIVE"
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">전체 상태</option>
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
              </select>

              {/* 중요도 필터 */}
              <select
                value={importanceFilter}
                onChange={(e) =>
                  setImportanceFilter(
                    e.target.value as "ALL" | "IMPORTANT" | "NORMAL"
                  )
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ALL">전체 중요도</option>
                <option value="IMPORTANT">중요</option>
                <option value="NORMAL">일반</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={loadNotices}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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
              <button
                onClick={() => setShowCreateModal(true)}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                공지사항 작성
              </button>
            </div>
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

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">공지사항을 불러오는 중...</p>
            </div>
          ) : filteredNotices.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                공지사항이 없습니다
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ||
                statusFilter !== "ALL" ||
                importanceFilter !== "ALL"
                  ? "검색 조건에 맞는 공지사항이 없습니다."
                  : "새로운 공지사항을 작성해보세요."}
              </p>
            </div>
          ) : (
            <>
              {/* 테이블 헤더 */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
                  <div className="col-span-1">ID</div>
                  <div className="col-span-4">제목</div>
                  <div className="col-span-2">작성자</div>
                  <div className="col-span-1">상태</div>
                  <div className="col-span-1">중요도</div>
                  <div className="col-span-1">조회수</div>
                  <div className="col-span-1">작성일</div>
                  <div className="col-span-1">관리</div>
                </div>
              </div>

              {/* 공지사항 목록 */}
              <div className="divide-y divide-gray-200">
                {filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* ID */}
                      <div className="col-span-1">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {notice.id}
                        </span>
                      </div>

                      {/* 제목 */}
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {notice.title}
                          </h3>
                          {notice.isImportant && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              중요
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {notice.content}
                        </p>
                      </div>

                      {/* 작성자 */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600">
                          {notice.author}
                        </span>
                      </div>

                      {/* 상태 */}
                      <div className="col-span-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            notice.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {notice.isActive ? "활성" : "비활성"}
                        </span>
                      </div>

                      {/* 중요도 */}
                      <div className="col-span-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            notice.isImportant
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {notice.isImportant ? "중요" : "일반"}
                        </span>
                      </div>

                      {/* 조회수 */}
                      <div className="col-span-1">
                        <span className="text-sm text-gray-600">
                          {notice.viewCount.toLocaleString()}
                        </span>
                      </div>

                      {/* 작성일 */}
                      <div className="col-span-1">
                        <span className="text-sm text-gray-500">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* 관리 버튼 */}
                      <div className="col-span-1">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openEditModal(notice)}
                            className="text-blue-600 hover:text-blue-900 text-xs"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => openDeleteModal(notice)}
                            className="text-red-600 hover:text-red-900 text-xs"
                          >
                            삭제
                          </button>
                        </div>
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
                      총 {filteredNotices.length}개의 공지사항
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

      {/* 공지사항 작성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              공지사항 작성
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="공지사항 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="공지사항 내용을 입력하세요"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isImportant}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isImportant: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">중요 공지사항</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">즉시 공개</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    title: "",
                    content: "",
                    isImportant: false,
                    isActive: true,
                  });
                  setError("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreateNotice}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                작성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 수정 모달 */}
      {showEditModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              공지사항 수정
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  내용
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isImportant}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isImportant: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">중요 공지사항</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">활성 상태</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedNotice(null);
                  setFormData({
                    title: "",
                    content: "",
                    isImportant: false,
                    isActive: true,
                  });
                  setError("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleEditNotice}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 삭제 모달 */}
      {showDeleteModal && selectedNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              공지사항 삭제
            </h2>
            <p className="text-gray-600 mb-6">
              "{selectedNotice.title}" 공지사항을 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedNotice(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDeleteNotice}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeList;
