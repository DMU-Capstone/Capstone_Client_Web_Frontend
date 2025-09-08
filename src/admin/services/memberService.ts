import api from '../config/api';

//전체 유저 조회
export const getAllMembers = async (page = 1, size = 10) => {
    try {
        const res = await api.get("/admin/users", {
            params: { page, size }, 
            headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (err) {
        console.error("회원 조회 실패", err);
        throw err;
    }
};

//아이디별로 조회
export const getMemberById = async (id: string) => {
    try {
        const res = await api.get(`/admin/users/${id}`, {
        headers: { "Content-Type": "application/json" },
        });
        return res.data;
    } catch (err) {
        throw err;
    }
}

//수정
export const updateMember = (id: number, data: any) =>
    api.patch(`/admin/users`, data, {
        headers: { "Content-Type": "application/json" },
    });

//삭제
export const deleteMember = (id: number, data: any) =>
    api.delete(`/admin/users/${id}`, { data })