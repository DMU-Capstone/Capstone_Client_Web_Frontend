<<<<<<< HEAD
const AdManager = () => {
  return (
    <div>
      <h2>광고 관리</h2>
      <p>광고를 관리합니다.</p>
    </div>
  );
};

export default AdManager;
=======
// import React, { useEffect, useState } from "react";
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Box, Typography } from "@mui/material"
// import "../styles/modalStyle.css"
// import { getAllAds, uploadAdImage, setMainBanner, deleteAd } from "../services/AdService";
// import RegisterAdModal from "../components/AdModal";
// import api, { BASE_URL } from "../config/api";
// import BannerModal from "../components/BannerModal";

// interface Ad {
//     id: number;
//     imgPath: string;
//     createdAt: string;
// }

// const AdManager = () => {
//     const [ads, setAds] = useState<Ad[]>([]);
//     const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [registerModalOpen, setRegisterModalOpen] = useState(false);
//     const [bannerModalOpen, setBannerModalOpen] = useState(false);

//     const fetchAds = async() => {
//         try {
//             const res = await getAllAds();
//             console.log(res.data);
//             setAds(res.data.content);
//         } catch {
//             alert("광고 목록을 불러오지 못했습니다.")
//         }
//     };

//     //이미지 업로드
//     const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file || selectedAd) return;

//         try {
//             await uploadAdImage(file);
//             alert("이미지 업로드 완료");
//             setModalOpen(false);
//             fetchAds();
//         } catch {
//             alert("이미지 업로드 실패");
//         }
//     };

//     const handleSetBanner = async (imgId: number, number: number) => {
//         try {
//             await setMainBanner(imgId, number);
//             alert(`메인 배너(${number})로 설정 완료`);
//         } catch {
//             alert("메인 배너 설정 실패");
//         }
//     };

//     const handleOpen = (ad: any) => {
//         setSelectedAd(ad);
//         setModalOpen(true);
//     };

//     const handleClose = () => {
//         setSelectedAd(null);
//         setModalOpen(false);
//     };

//     const handleDelete = async (id: number) => {
//         const confirmDelete = window.confirm("이미지를 삭제하시겠습니까?");
//         if (!confirmDelete) return;

//         try {
//             await deleteAd(id);
//             alert("이미지가 삭제되었습니다.");
//             fetchAds();
//         } catch (error) {
//             alert("삭제 실패했습니다.")
//         }
//     };

//     useEffect(() => {
//         fetchAds();
//         if (selectedAd) {
//             console.log("🟡 선택된 광고:", selectedAd);
//             console.log("🟡 선택된 광고 경로:", selectedAd.imgPath);
//         }
//     }, []);

//     return (
//         <>
//             <Typography variant="h5" gutterBottom>광고 목록</Typography>
//                 <Button variant="contained" color="primary" onClick={() => setRegisterModalOpen(true)}>
//                     광고 등록
//                 </Button>
//                 <Button
//                     variant="outlined"
//                     color="secondary"
//                     sx={{ml:1}}
//                     onClick={() => setBannerModalOpen(true)}>
//                     메인화면 배너 설정
//                 </Button>
//             <TableContainer component={Paper}>
//                 <Table>
//                     <TableHead>
//                         <TableRow>
//                             <TableCell>번호</TableCell>
//                             <TableCell>이미지</TableCell>
//                             <TableCell>등록일</TableCell>
//                             <TableCell>관리</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {ads.map((ad, index) => (
//                         <TableRow key={ad.id}>
//                             <TableCell>{index + 1}</TableCell>
//                             <TableCell>
//                                 <a
//                                     href={`${BASE_URL}${ad.imgPath}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer">
//                                     <img
//                                         src={`${BASE_URL}${ad.imgPath}`}
//                                         alt="이미지"
//                                         style={{ width: "100px", cursor: "pointer" }}/>
//                                 </a>
//                             </TableCell>
//                             <TableCell>
//                                 {new Date(ad.createdAt).toLocaleDateString()}
//                             </TableCell>
//                             <TableCell>
//                                 <Button variant="contained" onClick={() => handleOpen(ad)}>
//                                     수정
//                                 </Button>
//                                 <Button
//                                     variant="outlined"
//                                     color="error"
//                                     sx={{ ml: 1 }}
//                                     onClick={() => handleDelete(ad.id)}
//                                 >삭제</Button>
//                             </TableCell>
//                         </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>

//             <RegisterAdModal
//                 open={registerModalOpen}
//                 onClose={() => setRegisterModalOpen(false)}
//                 onSuccess={() => {
//                     setRegisterModalOpen(false);
//                     fetchAds();
//                 }}
//             />

//             <BannerModal
//                 open={bannerModalOpen}
//                 onClose={() => setBannerModalOpen(false)}
//             />

//             <Modal open={modalOpen} onClose={handleClose}>
//                 <Box className="modalBox">
//                     <Typography variant="h6" gutterBottom>광고 수정</Typography>

//                     {selectedAd && (
//                     <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle2">현재 이미지:</Typography>
//                         <img
//                             src={selectedAd.imgPath}
//                             alt="current ad"
//                             style={{ width: "200px", borderRadius: "8px", marginTop: "8px" }}
//                         />
//                     </Box>
//                     )}
//                     <Typography>이미지를 업로드</Typography>

//                     <input type="file" accept="image/*" onChange={handleImageChange}/>
//                     <Button sx={{mt:2}} onClick={handleClose} variant="contained" color="primary">
//                         닫기
//                     </Button>
//                 </Box>
//             </Modal>
//         </>
//     )
// }

// export default AdManager;
>>>>>>> origin/main
