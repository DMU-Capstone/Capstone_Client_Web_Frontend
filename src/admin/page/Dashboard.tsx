import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("대시보드");

  // 연결계정 목록 데이터
  const connectedAccounts = [
    {
      id: "kps1234",
      name: "김*수",
      phone: "010-****-1234",
      joinDate: "2024-01-15",
      lastAccess: "2024-12-31",
      role: "관리자",
    },
    {
      id: "system",
      name: "시스템",
      phone: "010-****-5678",
      joinDate: "2024-01-10",
      lastAccess: "2024-12-31",
      role: "시스템",
    },
    {
      id: "test",
      name: "테스트",
      phone: "010-****-9012",
      joinDate: "2024-01-20",
      lastAccess: "2024-12-30",
      role: "사용자",
    },
    {
      id: "adm",
      name: "관리자",
      phone: "010-****-3456",
      joinDate: "2024-01-05",
      lastAccess: "2024-12-31",
      role: "관리자",
    },
    {
      id: "user1",
      name: "사용자1",
      phone: "010-****-7890",
      joinDate: "2024-01-25",
      lastAccess: "2024-12-29",
      role: "사용자",
    },
  ];

  // 요일별 방문자 데이터 (최근 4주)
  const weeklyVisitorData = [
    { day: "일", 전체방문: 8, 재방문: 5, 신규방문: 3 },
    { day: "월", 전체방문: 12, 재방문: 8, 신규방문: 4 },
    { day: "화", 전체방문: 10, 재방문: 6, 신규방문: 4 },
    { day: "수", 전체방문: 15, 재방문: 10, 신규방문: 5 },
    { day: "목", 전체방문: 18, 재방문: 12, 신규방문: 6 },
    { day: "금", 전체방문: 20, 재방문: 14, 신규방문: 6 },
    { day: "토", 전체방문: 16, 재방문: 11, 신규방문: 5 },
  ];

  // 시간별 방문자 데이터 (최근 3일)
  const hourlyVisitorData = [
    { hour: "0시", 오늘: 2, 어제: 1, 엊그제: 0 },
    { hour: "4시", 오늘: 1, 어제: 0, 엊그제: 1 },
    { hour: "8시", 오늘: 5, 어제: 3, 엊그제: 2 },
    { hour: "12시", 오늘: 8, 어제: 6, 엊그제: 4 },
    { hour: "16시", 오늘: 6, 어제: 4, 엊그제: 3 },
    { hour: "20시", 오늘: 4, 어제: 3, 엊그제: 2 },
  ];

  // 접속 경로별 데이터
  const connectionPathData = [
    { name: "직접", visitors: 24, percentage: 96.0 },
    { name: "webmaking.kr", visitors: 1, percentage: 4.0 },
  ];

  // 신규방문 vs 재방문 데이터 (최근 7일)
  const newVsReturningData = [
    { date: "1일", 신규: 8, 재방문: 12 },
    { date: "2일", 신규: 6, 재방문: 15 },
    { date: "3일", 신규: 10, 재방문: 18 },
    { date: "4일", 신규: 7, 재방문: 14 },
    { date: "5일", 신규: 9, 재방문: 16 },
    { date: "6일", 신규: 5, 재방문: 13 },
    { date: "7일", 신규: 11, 재방문: 17 },
  ];

  // 접속 OS별 데이터
  const osData = [
    { name: "Unknown", visitors: 13, percentage: 52.0 },
    { name: "Win10", visitors: 9, percentage: 36.0 },
    { name: "Web", visitors: 2, percentage: 8.0 },
    { name: "iOS", visitors: 1, percentage: 4.0 },
  ];

  // 접속 유형별 데이터 (파이 차트용)
  const deviceTypeData = [
    { name: "Unknown", value: 13, color: "#3B82F6" },
    { name: "Desktop", value: 11, color: "#10B981" },
    { name: "Mobile Device", value: 1, color: "#F59E0B" },
  ];

  const totalVisitors = deviceTypeData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 상단 헤더 바 */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white text-white z-50 flex items-center justify-between px-6">
        <h1 className="text-xl font-bold">줄서기 어플 관리자 페이지</h1>
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

      {/* 사이드바 */}
      <div className="fixed top-16 left-0 h-full w-72 bg-white shadow-lg z-40">
        <Sidebar selectedMenu={selectedMenu} onSelectMenu={setSelectedMenu} />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 ml-72 pt-16 p-4">
        <div className="w-full">
          {/* 페이지 서브헤더 */}
          <div className="mb-4">
            <p className="text-gray-600">대시보드 - 시스템 현황 및 통계</p>
          </div>

          {/* 상단 위젯들 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* 연결계정 목록 현황 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                연결계정 목록 현황
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-medium text-gray-700">
                        아이디
                      </th>
                      <th className="text-left py-2 font-medium text-gray-700">
                        이름
                      </th>
                      <th className="text-left py-2 font-medium text-gray-700">
                        휴대폰
                      </th>
                      <th className="text-left py-2 font-medium text-gray-700">
                        가입일
                      </th>
                      <th className="text-left py-2 font-medium text-gray-700">
                        최종접속
                      </th>
                      <th className="text-left py-2 font-medium text-gray-700">
                        권한
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {connectedAccounts.map((account, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2 text-gray-900">{account.id}</td>
                        <td className="py-2 text-gray-900">{account.name}</td>
                        <td className="py-2 text-gray-900">{account.phone}</td>
                        <td className="py-2 text-gray-900">
                          {account.joinDate}
                        </td>
                        <td className="py-2 text-gray-900">
                          {account.lastAccess}
                        </td>
                        <td className="py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              account.role === "관리자"
                                ? "bg-red-100 text-red-800"
                                : account.role === "시스템"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {account.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-gray-600">
                <span>전체회원 5</span>
                <span>오늘 가입회원 0</span>
                <span>오늘 탈퇴회원 0</span>
                <span>총 탈퇴회원 0</span>
              </div>
            </div>

            {/* 요일별 방문자 현황 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                요일별 방문자 현황 (최근 4주)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyVisitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="전체방문" fill="#3B82F6" />
                    <Bar dataKey="재방문" fill="#10B981" />
                    <Bar dataKey="신규방문" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 중간 위젯들 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* 시간별 방문자 현황 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                시간별 방문자 현황 (최근 3일)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyVisitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="오늘"
                      stroke="#3B82F6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="어제"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="엊그제"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 접속 경로별 방문자 현황 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                접속 경로별 방문자 현황 (최근 7일)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={connectionPathData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 하단 위젯들 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* 신규방문 vs 재방문 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                신규방문 vs 재방문 (최근 7일)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={newVsReturningData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="신규" fill="#3B82F6" />
                    <Bar dataKey="재방문" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 접속 OS별 방문자 현황 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                접속 OS별 방문자 현황 (최근 7일)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={osData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 최근 게시물 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                최근 게시물
              </h3>
              <div className="text-center text-gray-500 py-6">
                자료가 없습니다
              </div>
            </div>
          </div>

          {/* 접속 유형별 차트 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              접속 유형별 (모바일, 태블릿, PC)
            </h3>
            <div className="flex items-center justify-center">
              <div className="w-80 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
