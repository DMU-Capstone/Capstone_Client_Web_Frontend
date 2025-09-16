import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  selectedMenu: string;
  onSelectMenu: (menu: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  description: string;
  route?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  subMenus?: SubMenuItem[];
  route?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedMenu, onSelectMenu }) => {
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      id: "대시보드",
      label: "대시보드",
      route: "/admin/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
          />
        </svg>
      ),
      description: "메인 대시보드",
    },
    {
      id: "회원관리",
      label: "회원관리",
      icon: (
        <svg
          className="w-5 h-5"
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
      ),
      description: "회원 정보 관리",
      subMenus: [
        {
          id: "자영업자 회원",
          label: "자영업자 회원",
          description: "전체 회원 조회",
          route: "/admin/members/business",
        },
        {
          id: "사용자 회원",
          label: "사용자 회원",
          description: "신규 회원 추가",
          route: "/admin/members",
        },
        {
          id: "회원통계",
          label: "회원통계",
          description: "회원 현황 분석",
          route: "/admin/members/statistics",
        },
      ],
    },
    {
      id: "대기열내역",
      label: "대기열내역",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
      description: "대기열 현황 조회",
      subMenus: [
        {
          id: "실시간대기열",
          label: "실시간대기열",
          description: "현재 대기 현황",
          route: "/admin/queue/realtime",
        },
        {
          id: "대기열이력",
          label: "대기열이력",
          description: "과거 대기 기록",
          route: "/admin/queue/history",
        },
        {
          id: "대기열설정",
          label: "대기열설정",
          description: "대기열 관리 설정",
          route: "/admin/queue/settings",
        },
      ],
    },
    {
      id: "이벤트배너등록",
      label: "이벤트배너등록",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
      description: "배너 및 이벤트 관리",
      subMenus: [
        {
          id: "배너관리",
          label: "배너관리",
          description: "메인 배너 관리",
          route: "/admin/mainbanner",
        },
        {
          id: "이벤트관리",
          label: "이벤트관리",
          description: "이벤트 등록/수정",
          route: "/admin/notices",
        },
        {
          id: "광고관리",
          label: "광고관리",
          description: "광고 콘텐츠 관리",
          route: "/admin/ads",
        },
      ],
    },
    {
      id: "실시간모니터링",
      label: "실시간모니터링",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      description: "실시간 대시보드",
      subMenus: [
        {
          id: "대시보드",
          label: "대시보드",
          description: "전체 현황 모니터링",
          route: "/admin/monitoring/dashboard",
        },
        {
          id: "알림관리",
          label: "알림관리",
          description: "시스템 알림 설정",
          route: "/admin/monitoring/notifications",
        },
        {
          id: "로그조회",
          label: "로그조회",
          description: "시스템 로그 확인",
          route: "/admin/monitoring/logs",
        },
      ],
    },
    {
      id: "설정",
      label: "설정",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      description: "시스템 설정",
      subMenus: [
        {
          id: "시스템설정",
          label: "시스템설정",
          description: "기본 시스템 설정",
          route: "/admin/settings/system",
        },
        {
          id: "사용자권한",
          label: "사용자권한",
          description: "관리자 권한 관리",
          route: "/admin/settings/permissions",
        },
        {
          id: "백업복원",
          label: "백업복원",
          description: "데이터 백업/복원",
          route: "/admin/settings/backup",
        },
      ],
    },
  ];

  const handleMenuClick = (menuId: string, route?: string) => {
    onSelectMenu(menuId);

    if (route) {
      navigate(route);
    }
  };

  return (
    <div
      className={`
        fixed top-0 left-0  w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-none lg:border-r lg:border-gray-200 h-screen
      `}
    >
      {/* 헤더 */}
      <div className="bg-blue-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-white">
            <h1 className="text-lg font-bold">관리자 패널</h1>
            <p className=" text-sm">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* 메뉴 리스트 */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <div
                onMouseEnter={() => setHoveredMenu(item.id)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  onClick={() => handleMenuClick(item.id, item.route)}
                  className={`
                      w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200
                      ${
                        selectedMenu === item.id
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                >
                  <div
                    className={`
                      flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg mr-3
                      ${
                        selectedMenu === item.id
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      }
                    `}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                        text-sm font-medium truncate
                        ${
                          selectedMenu === item.id
                            ? "text-blue-700"
                            : "text-gray-900"
                        }
                      `}
                    >
                      {item.label}
                    </p>
                    <p
                      className={`
                        text-xs truncate
                        ${
                          selectedMenu === item.id
                            ? "text-blue-500"
                            : "text-gray-500"
                        }
                      `}
                    >
                      {item.description}
                    </p>
                  </div>
                  {/* 화살표 아이콘 */}
                  {item.subMenus && (
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        hoveredMenu === item.id ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>

                {/* 서브메뉴 - 인라인으로 배치 */}
                {item.subMenus && hoveredMenu === item.id && (
                  <ul className="mt-1 space-y-1">
                    {item.subMenus.map((subMenu) => (
                      <li key={subMenu.id}>
                        <button
                          onClick={() =>
                            handleMenuClick(subMenu.id, subMenu.route)
                          }
                          className="w-full flex items-center px-8 py-2 text-left hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                              {subMenu.label}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {subMenu.description}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* 푸터 */}
      <div className="border-t border-gray-200 p-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">© 2025 Admin Panel</p>
          <p className="text-xs text-gray-400">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
