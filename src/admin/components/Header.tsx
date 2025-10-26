const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white text-white z-50 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold">WAIT IT : IT</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="검색..."
            className="px-3 py-1 bg-gray-200 text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <a href="#" className="hover:text-blue-200 transition-colors">
            서비스 운행 가이드
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            현지팩에 문의
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            현지팩 문의목록
          </a>
          <a href="#" className="hover:text-blue-200 transition-colors">
            사이트 바로가기
          </a>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Header;