import { useState } from "react";
import {
  Typography,
  Grid,
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Pagination,
} from "@mui/material";
import { Search, Refresh } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([1]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMenu, setSelectedMenu] = useState("회원관리");

  const members = [
    {
      id: 1,
<<<<<<< HEAD
      juid: "124U97s300",
=======
      uuid: "D124U97s300",
>>>>>>> origin/main
      userId: "dongy***",
      name: "김*수",
      nickname: "IronWater",
      joinDate: "2025-02-31",
    },
<<<<<<< HEAD
    ...Array.from({ length: 9 }, (_, i) => ({
      id: i + 2,
      juid: "",
=======
    // 나머지 9개 행은 빈 데이터
    ...Array.from({ length: 9 }, (_, i) => ({
      id: i + 2,
      uuid: "",
>>>>>>> origin/main
      userId: "",
      name: "",
      nickname: "",
      joinDate: "",
    })),
  ];

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(members.map((member) => member.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
  };

  const isAllSelected = selectedRows.length === members.length;
<<<<<<< HEAD
  const isIndeterminate =
    selectedRows.length > 0 && selectedRows.length < members.length;
=======
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < members.length;
>>>>>>> origin/main

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedMenu={selectedMenu} onSelectMenu={handleMenuSelect} />
      <div className="flex-1 ml-64">
        <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
<<<<<<< HEAD
=======
          {/* 헤더 */}
>>>>>>> origin/main
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
            >
              회원 관리
            </Typography>
            <Typography variant="body1" sx={{ color: "#666" }}>
              회원 정보를 조회하고 관리할 수 있습니다
            </Typography>
          </Box>

<<<<<<< HEAD
=======
          {/* 검색 및 필터 영역 */}
>>>>>>> origin/main
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="회원번호 혹은 이름으로 검색"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  sx={{
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  조회
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  sx={{ borderColor: "#1976d2", color: "#1976d2" }}
                >
                  새로고침
                </Button>
              </Grid>
            </Grid>

<<<<<<< HEAD
=======
            {/* 날짜 필터 */}
>>>>>>> origin/main
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
              <Grid item>
                <TextField
                  label="연"
                  variant="outlined"
                  size="small"
                  sx={{ width: 80 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="월"
                  variant="outlined"
                  size="small"
                  sx={{ width: 80 }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="일"
                  variant="outlined"
                  size="small"
                  sx={{ width: 80 }}
                />
              </Grid>
              <Grid item sx={{ ml: "auto" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#666",
                    "&:hover": { backgroundColor: "#555" },
                  }}
                >
                  삭제
                </Button>
              </Grid>
            </Grid>
          </Paper>

<<<<<<< HEAD
          <Paper sx={{ overflow: "hidden" }}>
=======
          {/* 데이터 테이블 */}
          <Paper sx={{ overflow: "hidden", border: "1px solid #e0e0e0" }}>
>>>>>>> origin/main
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>번호</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>UUID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>아이디</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>이름</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>닉네임</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>가입일</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {members.map((member) => (
                    <TableRow
                      key={member.id}
                      sx={{
                        "&:hover": { backgroundColor: "#f8f9fa" },
                        backgroundColor: selectedRows.includes(member.id)
                          ? "#e3f2fd"
                          : "white",
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedRows.includes(member.id)}
                          onChange={() => handleSelectRow(member.id)}
<<<<<<< HEAD
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member.juid}</TableCell>
=======
                        />
                      </TableCell>
                      <TableCell>{member.id}</TableCell>
                      <TableCell>{member.uuid}</TableCell>
>>>>>>> origin/main
                      <TableCell>{member.userId}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.nickname}</TableCell>
                      <TableCell>{member.joinDate}</TableCell>
                      <TableCell>
                        {member.id === 1 && (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              backgroundColor: "#666",
                              "&:hover": { backgroundColor: "#555" },
                            }}
                          >
                            관리
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

<<<<<<< HEAD
=======
            {/* 페이지네이션 */}
>>>>>>> origin/main
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <Pagination
                count={9}
                page={currentPage}
<<<<<<< HEAD
                onChange={(_, page) => setCurrentPage(page)}
=======
                onChange={(event, page) => setCurrentPage(page)}
>>>>>>> origin/main
                color="primary"
                showFirstButton
                showLastButton
                siblingCount={2}
                boundaryCount={1}
              />
            </Box>
          </Paper>
        </Box>
      </div>
    </div>
  );
};

export default Dashboard;
