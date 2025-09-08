import { getAllQueues, getActiveQueues, getQueueDetail } from "../services/queueService";
import '../styles/Admin.css';
import { useNavigate } from "react-router-dom";
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper, TableContainer, Button, Box, Modal, Typography} from "@mui/material";
import { useEffect, useState } from "react";

interface RegisterQueueModalProps {
    open: boolean;
    onClose: () => void;
    endedQueues: Queue[];
}

interface Queue {
    id: number;
    hostName: string;
    maxPeople: number;
    hostManagerName: string;
    hostPhoneNumber: string;
    latitude: number;
    longitude: number;
    keyword: string;
    description: string;
    startTime: string;
    endTime: string;
}

const EndQueueModal: React.FC<RegisterQueueModalProps> = ({ open, onClose}) => {
    const [endedQueues, setEndedQueues] = useState<Queue[]>([]);
    const [queue, setQueue] = useState<Queue[]>([]);  //queue 배열
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredQueue, setFilteredQueue] = useState<any[]>([]);

    const fetchEndQueue = async () => {
        try {
            const { data } = await getAllQueues();
            const allQueues: Queue[] = data.content;

            const now = new Date().getTime();

            const ended = allQueues.filter(q => new Date(q.endTime).getTime() <= now);
        
            setEndedQueues(ended);
            setQueue(allQueues);
            } catch {
                alert("대기열 불러오기 실패");
            }
    }

    const handleSearch = () => {
        if (searchTerm.trim() === "") {
            setFilteredQueue(queue);
        } else {
            const filtered = queue.filter(q => 
                q.hostName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredQueue(filtered);
        }
    };

    useEffect(() => {
        fetchEndQueue();
    }, []);

    return(
    <Modal open={open} onClose={onClose}>
        <Box className="modalBox" sx={{width: 1000, maxHeight: "90%", overflowY: "auto"}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" gutterBottom>종료된 대기열 기록</Typography>
                <button onClick={onClose} style={{ backgroundColor : "white" }}>X</button>
            </Box>

            <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    
                <TableRow>
                    <TableCell>호스트명</TableCell>
                    <TableCell>대기인원</TableCell>
                    <TableCell>매니저</TableCell>
                    <TableCell>시작</TableCell>
                    <TableCell>종료</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {endedQueues.map(q => (
                    <TableRow key={q.id}>
                    <TableCell>{q.hostName}</TableCell>
                    <TableCell>{q.maxPeople} 명</TableCell>
                    <TableCell>{q.hostManagerName}</TableCell>
                    <TableCell>{q.startTime}</TableCell>
                    <TableCell>{q.endTime}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>

            
        </Box>
    </Modal>
    );
}

export default EndQueueModal;