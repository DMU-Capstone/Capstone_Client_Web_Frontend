// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Modal,
//   Typography,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Button,
// } from "@mui/material";
// import { Add, ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
// import { getAllAds } from "../services/AdService";
// // import api, { BASE_URL } from "../config/api";

// interface Ad {
//   id: number;
//   imgPath: string;
//   createdAt: string;
// }

// interface Props {
//   open: boolean;
//   onClose: () => void;
// }

// const BannerModal: React.FC<Props> = ({ open, onClose }) => {
//   const [banners, setBanners] = useState<Ad[]>([]); // imgPath 배열
//   const [ads, setAds] = useState<Ad[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const fetchAds = async () => {
//     try {
//       const res = await getAllAds();
//       setAds(res.data.content);
//     } catch {
//       alert("광고 불러오기 실패");
//     }
//   };
//   const handleAddBanner = (ad: Ad) => {
//     if (!banners.find((b) => b.id === ad.id)) {
//       setBanners([...banners, ad]);
//       setCurrentIndex(banners.length);
//     }
//   };
//   const handleAddClick = () => {
//     // 광고 목록 선택용 모달 띄우거나 API 요청 후 추가 (구현 예정)
//     alert("DB에서 광고 이미지 선택");
//   };

//   //메인으로 추가
//   const handlePrev = () => {
//     if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
//   };
//   const handleNext = () => {
//     if (currentIndex < banners.length) setCurrentIndex(currentIndex + 1);
//   };
//   const renderContent = () => {
//     if (currentIndex === banners.length) {
//       return (
//         <IconButton onClick={handleAddClick} sx={{ fontSize: 80 }}>
//           <Add fontSize="inherit" />
//         </IconButton>
//       );
//     }

//     return (
//       <img
//         src={`${BASE_URL}${banners[currentIndex]}`}
//         alt="배너"
//         style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
//       />
//     );
//   };
//   useEffect(() => {
//     if (open) fetchAds();
//   }, [open]);

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box className="modalBox" sx={{ width: 600 }}>
//         <Typography variant="h6" mb={2}>
//           미리보기
//         </Typography>
//         {/* 미리보기 */}
//         <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
//           <IconButton onClick={handlePrev}>
//             <ArrowBackIos />
//           </IconButton>
//           <Box>
//             {currentIndex === banners.length ? (
//               <IconButton
//                 onClick={() => alert("하단 목록에서 이미지를 추가하세요.")}
//               >
//                 <Add sx={{ fontSize: 80 }} />
//               </IconButton>
//             ) : (
//               <img
//                 src={`${BASE_URL}${banners[currentIndex].imgPath}`}
//                 alt="banner"
//                 style={{ width: 400, height: 200, objectFit: "contain" }}
//               />
//             )}
//           </Box>
//           <IconButton onClick={handleNext}>
//             <ArrowForwardIos />
//           </IconButton>
//         </Box>

//         <Typography variant="subtitle1" gutterBottom>
//           광고 목록에서 추가
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>번호</TableCell>
//                 <TableCell>이미지</TableCell>
//                 <TableCell>등록일</TableCell>
//                 <TableCell>추가</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {ads.map((ad, index) => (
//                 <TableRow key={ad.id}>
//                   <TableCell>{index + 1}</TableCell>
//                   <TableCell>
//                     <img
//                       src={`${BASE_URL}${ad.imgPath}`}
//                       alt="ad"
//                       style={{ width: 100 }}
//                     />
//                   </TableCell>
//                   <TableCell>
//                     {new Date(ad.createdAt).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell>
//                     <Button
//                       variant="outlined"
//                       size="small"
//                       onClick={() => handleAddBanner(ad)}
//                     >
//                       추가
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Modal>
//   );
// };

// export default BannerModal;
