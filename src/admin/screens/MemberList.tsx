<<<<<<< HEAD
const MemberListScreen = () => {
  return (
    <div>
      <h2>회원 관리</h2>
      <p>회원 정보를 관리합니다.</p>
    </div>
  );
};

export default MemberListScreen;
=======
// import React, { Children, useEffect, useState } from "react";
// import { deleteMember, getAllMembers} from "../services/memberService";
// import '../styles/Admin.css';
// import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper, TableContainer, Button, Box} from "@mui/material";
// import EditMemberModal from "../components/MemberModal";
// import { updateMember } from "../services/memberService";

// interface Member {
//     id: number;
//     name: string;
//     nickName: string;
//     phoneNumber: string;
//     gender: string;
//     create_date? : string;
// }

// const MemberListScreen = () => {
//     //삭제
//     const handleDelete = async () => {
//         const confirmed = window.confirm("회원정보를 삭제하시겠습니까?")
//         if (!confirmed) return;

//         try {
//             for (const id of selectedIds) {
//                 const memberToDelete = members.find((m) => m.id === id);
//                 if (memberToDelete) {
//                     await deleteMember(id, memberToDelete);
//                 }
//             }
//             fetchMembers();
//             setSelectedIds([]);
//         } catch (e) {
//             alert("삭제실패");
//         }
//     };

//     //수정, 모달
//     const [modalOpen, setModalOpen] = useState(false);
//     const [selectedMember, setSelectedMember] = useState<Member | null>(null);

//     const handleOpenModal = (member: Member) => {
//         setSelectedMember(member);
//         setModalOpen(true);
//     }

//     const handleSave = async (updatedMember: Member) => {
//         try {
//             await updateMember(updatedMember.id, updatedMember);
//             fetchMembers();
//             setModalOpen(false);
//         } catch(e) {
//             alert("수정 실패")
//         }
//     };

//     //검색창
//     const [searchTerm, setSearchTerm] = useState('');

//     const handleSearch = () => {
//         if(searchTerm.trim() === '') {
//             setFilteredMembers(members);
//         } else {
//             const filtered = members.filter((member) =>
//                 member.name.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//             setFilteredMembers(filtered);
//         }
//     }

//     //members 배열
//     const [members, setMembers] = useState<Member[]>([]);
//     const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);

//     //체크박스
//     const [selectedIds, setSelectedIds] = useState<number[]>([]);
//     const isAllSelected = selectedIds.length === members.length;

//     const handleToggleAll = () => {
//     if (isAllSelected) {
//         setSelectedIds([]);
//     } else {
//         setSelectedIds(filteredMembers.map((member) => member.id));
//     }
//     };
//     const handleToggleOne = (id: number) => {
//         setSelectedIds((prev) =>
//           prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//         );
//       };

//     //fetch
//     const fetchMembers = async() => {
//         try {
//             const data = await getAllMembers();
//             console.log("✅ 서버 응답 데이터:", data);
//             const members = Array.isArray(data?.content) ? data. content : data;
//             setMembers(members);
//             setFilteredMembers(members)
//         } catch (e) {
//             alert("회원 목록을 불러오지 못했습니다");
//             setMembers([]);
//             setFilteredMembers([]);
//         }
//     }

//     useEffect(() => {
//         fetchMembers();
//     }, []);

//     return (
//     <div>
//         <div className="contentArea"
//             style={{
//                 transition: "margin 0.4s ease",
//                 justifyContent: "flex-start",
//                 alignItems: "flex-start"
//             }}
//         >

//         <Box display="flex" justifyContent="flex-start" alignItems="flex-start" gap={2} mb={3} mt={2}>
//             <TextField
//                 label="이름으로 검색"
//                 variant="outlined"
//                 size="small"
//                 sx={{ width: 300 }}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//             />

//             <Button
//                 variant="contained"
//                 size="medium"
//                 onClick={handleSearch}
//             >검색</Button>
//             <Button
//                 variant="contained"
//                 size="medium"
//                 onClick={handleDelete}>삭제
//             </Button>
//         </Box>

//         <TableContainer component={Paper} className="container">
//             <Table className="table">

//                 <TableHead>
//                     <TableRow>
//                         <TableCell padding="checkbox">
//                             <Checkbox
//                                 checked={isAllSelected}
//                                 indeterminate={selectedIds.length > 0 && !isAllSelected}
//                                 onChange={handleToggleAll}
//                             />
//                         </TableCell>
//                         <TableCell>이름</TableCell>
//                         <TableCell>닉네임</TableCell>
//                         <TableCell>이메일</TableCell>
//                         <TableCell>성별</TableCell>
//                         <TableCell>관리</TableCell>
//                     </TableRow>
//                 </TableHead>

//                 <TableBody>
//                     {filteredMembers.map((member) => (
//                         <TableRow key={member.id} selected={selectedIds.includes(member.id)}>
//                             <TableCell padding="checkbox">
//                                 <Checkbox
//                                     checked={selectedIds.includes(member.id)}
//                                     onChange={()=>handleToggleOne(member.id)}
//                                 />
//                             </TableCell>
//                             <TableCell>{member.name}</TableCell>
//                             <TableCell>{member.nickName}</TableCell>
//                             <TableCell>{member.phoneNumber}</TableCell>
//                             <TableCell>{member.gender}</TableCell>
//                             <TableCell>
//                                 <Button variant="contained"
//                                 size="small"
//                                 color="primary"
//                                 onClick={() => handleOpenModal(member)}>수정</Button>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>

//             </Table>
//         </TableContainer>
//         </div>
//         <EditMemberModal
//             open={modalOpen}
//             onClose={() => setModalOpen(false)}
//             onSave={handleSave}
//             member={selectedMember}
//         />

//     </div>
//     );
// };

// export default MemberListScreen;
>>>>>>> origin/main
