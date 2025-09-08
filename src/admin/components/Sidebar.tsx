import { useState } from "react";

interface SidebarProps {
  width?: number;
  selectedMenu?: string;
  onSelectMenu?: (menu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  width = 280,
  onSelectMenu,
  selectedMenu,
}) => {

  const [isCollapsed, setIsCollapsed] = useState(false);


  const menuItems = [
    {
      id: "관리페이지",
      label: "관리페이지",
      hasSubmenu: true,
      submenu: [
        { id: "회원관리", label: "회원관리" },
        { id: "대기열내역", label: "대기열 내역" },
        { id: "이벤트배너등록", label: "이벤트 배너 등록" },
        { id: "실시간모니터링", label: "실시간 모니터링" },
      ],
    },
    { id: "실시간모니터링", label: "실시간 모니터링", hasSubmenu: false },
    { id: "관리페이지2", label: "관리페이지", hasSubmenu: false },
    { id: "관리페이지3", label: "관리페이지", hasSubmenu: false },
    { id: "설정", label: "설정", hasSubmenu: false },
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (menuId: string, hasSubmenu: boolean) => {
    hasSubmenu ? toggleSubmenu(menuId) : onSelectMenu?.(menuId);
  };

  return (
    <div
      className="fixed top-0 left-0 bottom-0 bg-blue-600 border-r border-blue-700 transition-all duration-300 z-50"

      style={{ width: `${width}px` }}
    >
      <div className="px-4 py-4 border-b border-blue-700">
        <div className="flex items-center mb-3">
          <div className="w-16 h-8 bg-white border border-gray-800 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-800">로고</span>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
          <span className="text-white text-sm">👤</span>
        </div>
      </div>

      <div className="py-2">
        {menuItems.map((menu) => (

      style={{ width: `${isCollapsed ? 80 : width}px` }}
    >
      <div className="px-4 py-4 border-b border-blue-700">
        {!isCollapsed && (
          <div className="flex items-center mb-3">
            <div className="w-16 h-8 bg-white border border-gray-800 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-800">로고</span>
            </div>
          </div>
        )}
        {!isCollapsed && (
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">👤</span>
          </div>
        )}
      </div>

      <div className="py-2">
        {menuItems.map((menu, index) => (

          <div key={menu.id}>
            <button
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all ${
                selectedMenu === menu.id
                  ? "bg-blue-800 text-white"
                  : menu.hasSubmenu
                  ? "bg-blue-500 text-white hover:bg-blue-400"
                  : "text-white hover:bg-blue-500"
              }`}
              onClick={() => handleMenuClick(menu.id, menu.hasSubmenu)}

            >
              <span>{menu.label}</span>
              {menu.hasSubmenu && (
                <span
                  className={`transition-transform text-white ${
                    expandedMenus.includes(menu.id) ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>

              title={isCollapsed ? menu.label : undefined}
            >
              {!isCollapsed && (
                <>
                  <span>{menu.label}</span>
                  {menu.hasSubmenu && (
                    <span
                      className={`transition-transform text-white ${
                        expandedMenus.includes(menu.id) ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  )}
                </>

              )}
            </button>

            {menu.hasSubmenu &&

              expandedMenus.includes(menu.id) && (

              expandedMenus.includes(menu.id) &&
              !isCollapsed && (

                <div className="bg-blue-500">
                  {menu.submenu?.map((submenu) => (
                    <button
                      key={submenu.id}
                      className={`w-full flex items-center px-6 py-2 text-sm transition-all ${
                        selectedMenu === submenu.id
                          ? "bg-blue-400 text-white font-medium"
                          : "text-white hover:bg-blue-400"
                      }`}
                      onClick={() => onSelectMenu?.(submenu.id)}
                    >
                      {submenu.label}
                    </button>
                  ))}

                  <div className="border-t border-blue-400 my-1"></div>
                </div>
              )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-400"></div>
    </div>
  );
};

export default Sidebar;
