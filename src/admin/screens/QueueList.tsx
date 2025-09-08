<<<<<<< HEAD
const QueueList = () => {
  return (
    <div>
      <h2>대기열 관리</h2>
      <p>대기열 정보를 관리합니다.</p>
    </div>
  );
};

export default QueueList;
=======
// import React, { useEffect, useState } from "react";
// import {
//   getAllQueues,
//   getActiveQueues,
//   getQueueDetail,
// } from "../services/queueService";
// import "../styles/Admin.css";
// import { useNavigate } from "react-router-dom";
// import {
//   Checkbox,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   TextField,
//   Paper,
//   TableContainer,
//   Button,
//   Box,
// } from "@mui/material";
// import EndQueueModal from "../components/QueueModal";
// import { BASE_URL } from "../config/api";

// interface Queue {
//   id: number;
//   hostName: string;
//   maxPeople: number;
//   hostManagerName: string;
//   hostPhoneNumber: string;
//   latitude: number;
//   longitude: number;
//   keyword: string;
//   description: string;
//   startTime: string;
//   endTime: string;
//   active: boolean;
// }

// interface ActiveQueue {
//   id: number;
//   name: string;
//   hostImage: {
//     imgPath: string;
//     createdAt: string;
//   };
// }

// interface QueueDetail {
//   phoneNumber: string;
//   name: string;
//   count: number;
// }

// const QueueList = () => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeQueues, setActiveQueues] = useState<Queue[]>([]);
//   const [endedQueues, setEndedQueues] = useState<Queue[]>([]);
//   const [queueModalOpen, setQueueModalOpen] = useState(false);
//   const [queue, setQueue] = useState<Queue[]>([]);
//   const [filteredQueue, setFilteredQueue] = useState<Queue[]>([]);
//   const [activeCounts, setActiveCounts] = useState<Record<number, number>>({});
//   const [activeQueuesInfos, setActiveQueuesInfos] = useState<ActiveQueue[]>([]);
//   const [page, setPage] = useState(0);
//   const [size, setSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);

//   const fetchActiveCounts = async () => {
//     try {
//       const { data: activeList } = await getActiveQueues();
//       setActiveQueuesInfos(activeList);

//       const countsMap: Record<number, number> = {};
//       await Promise.all(
//         activeList.map(async (queue: ActiveQueue) => {
//           const { data } = await getQueueDetail(queue.id);
//           countsMap[queue.id] = data?.[0]?.count ?? 0;
//         })
//       );

//       setActiveCounts(countsMap);
//     } catch (error) {
//       console.error("Redis 실시간 큐 조회 실패", error);
//     }
//   };

//   const fetchAll = async () => {
//     try {
//       const { data } = await getAllQueues(page, size);
//       const allQueues: Queue[] = data.content;

//       const active = allQueues.filter((q) => q.active);
//       const ended = allQueues.filter((q) => !q.active);

//       setActiveQueues(active);
//       setEndedQueues(ended);
//       setQueue(allQueues);
//       setFilteredQueue(active);
//       setTotalPages(data.totalPages);

//       if (active.length === 0) {
//         alert("현재 활성화된 대기열이 없습니다.");
//       }
//     } catch (err) {
//       alert("대기열 목록을 불러오지 못했습니다.");
//     }
//   };

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   useEffect(() => {
//     fetchAll();
//     fetchActiveCounts();
//   }, [page]);

//   const handleSearch = () => {
//     const filtered = activeQueues.filter((q) =>
//       q.hostName.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredQueue(filtered);

//     if (filtered.length === 0) {
//       alert("검색된 활성 대기열이 없습니다.");
//     }
//   };

//   const [selectedIds, setSelectedIds] = useState<number[]>([]);
//   const isAllSelected = selectedIds.length === queue.length;

//   const handleToggleOne = (id: number) => {
//     setSelectedIds((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   const handleToggleAll = () => {
//     if (isAllSelected) {
//       setSelectedIds([]);
//     } else {
//       setSelectedIds(filteredQueue.map((q) => q.id));
//     }
//   };

//   return (
//     <div
//       className="contentArea"
//       style={{
//         transition: "margin 0.4s ease",
//         justifyContent: "flex-start",
//         alignItems: "flex-start",
//       }}
//     >
//       <Box
//         display="flex"
//         justifyContent="flex-start"
//         alignItems="flex-start"
//         gap={2}
//         mb={3}
//         mt={2}
//       >
//         <TextField
//           label="호스트 이름 검색"
//           variant="outlined"
//           size="small"
//           sx={{ width: 300 }}
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />

//         <Button variant="contained" size="medium" onClick={handleSearch}>
//           검색
//         </Button>
//         <Button
//           variant="outlined"
//           sx={{ ml: 2 }}
//           onClick={() => setQueueModalOpen(true)}
//         >
//           기록 확인하기
//         </Button>
//       </Box>

//       <TableContainer component={Paper} className="container">
//         <Table className="table">
//           <TableHead>
//             <TableRow>
//               <TableCell padding="checkbox">
//                 <Checkbox
//                   checked={isAllSelected}
//                   indeterminate={selectedIds.length > 0 && !isAllSelected}
//                   onChange={handleToggleAll}
//                 />
//               </TableCell>
//               <TableCell>호스트명</TableCell>
//               <TableCell>대기인원</TableCell>
//               <TableCell>매니저</TableCell>
//               <TableCell>시작</TableCell>
//               <TableCell>상태</TableCell>
//               <TableCell>종료</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredQueue.map((q) => (
//               <TableRow key={q.id} selected={selectedIds.includes(q.id)}>
//                 <TableCell padding="checkbox">
//                   <Checkbox
//                     checked={selectedIds.includes(q.id)}
//                     onChange={() => handleToggleOne(q.id)}
//                   />
//                 </TableCell>
//                 <TableCell>
//                   <Box display="flex" alignItems="center" gap={1}>
//                     {activeQueuesInfos.find((a) => a.id === q.id)?.hostImage
//                       ?.imgPath && (
//                       <img
//                         src={`${BASE_URL}${
//                           activeQueuesInfos.find((a) => a.id === q.id)
//                             ?.hostImage.imgPath
//                         }`}
//                         alt="host"
//                         style={{
//                           width: 40,
//                           height: 40,
//                           objectFit: "cover",
//                           borderRadius: "50%",
//                         }}
//                       />
//                     )}
//                     {q.hostName}
//                   </Box>
//                 </TableCell>
//                 <TableCell>{q.hostName}</TableCell>
//                 <TableCell>{q.maxPeople} 명</TableCell>
//                 <TableCell>{q.hostManagerName}</TableCell>
//                 <TableCell>{q.startTime}</TableCell>
//                 <TableCell>
//                   {activeCounts[q.id] != null
//                     ? `활성화 / ${activeCounts[q.id]} 명`
//                     : "종료"}
//                 </TableCell>
//                 <TableCell>{q.endTime}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Box mt={2} display="flex" justifyContent="center" gap={1}>
//         <Button
//           disabled={page === 0}
//           onClick={() => handlePageChange(page - 1)}
//         >
//           이전
//         </Button>
//         <span>
//           페이지 {page + 1} / {totalPages}
//         </span>
//         <Button
//           disabled={page + 1 >= totalPages}
//           onClick={() => handlePageChange(page + 1)}
//         >
//           다음
//         </Button>
//       </Box>

//       <EndQueueModal
//         open={queueModalOpen}
//         onClose={() => setQueueModalOpen(false)}
//         endedQueues={endedQueues}
//       />
//     </div>
//   );
// };

// export default QueueList;
>>>>>>> origin/main
