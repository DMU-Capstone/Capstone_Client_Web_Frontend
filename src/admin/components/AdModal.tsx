import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { uploadAdImage } from "../services/AdService";
import "../styles/modalStyle.css";

interface RegisterAdModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const RegisterAdModal: React.FC<RegisterAdModalProps> = ({ open, onClose, onSuccess }) => {
    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            await uploadAdImage(file);
            alert("광고 등록 완료");
            onSuccess();
        } catch {
            alert("광고 등록 실패");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="modalBox">
                <Typography variant="h6" gutterBottom>광고 등록</Typography>
                <Typography>이미지를 업로드하세요</Typography>
                <input type="file" accept="image/*" onChange={handleUpload} />
                <Button sx={{ mt: 2 }} onClick={onClose} variant="contained" color="primary">
                닫기
                </Button>
            </Box>
        </Modal>
    );
};

export default RegisterAdModal;