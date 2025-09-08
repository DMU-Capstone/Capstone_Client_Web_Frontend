import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

interface Member {
    id: number;
    name: string;
    nickName: string;
    phoneNumber: string;
    gender: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (member: Member) => void;
    member: Member | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (member:Member) => void;
    member: Member | null;
}

const EditMemberModal: React.FC<Props> = ({ open, onClose, onSave, member }) => {
    const [edited, setEdited] = React.useState<Member | null>(member);

    React.useEffect(() => {
        setEdited(member);
    }, [member]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!edited) return;
        setEdited({ ...edited, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>회원 정보 수정</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField name="name" label="이름" value={edited?.name || ''} onChange={handleChange} />
                    <TextField name="nickName" label="닉네임" value={edited?.nickName || ''} onChange={handleChange} />
                    <TextField name="phoneNumber" label="전화번호" value={edited?.phoneNumber || ''} onChange={handleChange} />
                    <TextField name="gender" label="성별" value={edited?.gender || ''} onChange={handleChange} />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>취소</Button>
                <Button onClick={() => edited && onSave(edited)} variant="contained">저장</Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMemberModal;