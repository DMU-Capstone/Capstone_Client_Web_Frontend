import api from '../config/api'

//모든 대기열 조회
export const getAllQueues = async (page = 0, size = 10) => {
    return api.get('/admin/hosts', {
        params: { page: page + 1, size },
        headers: { "Content-Type": "application/json" },
    });
};

//실시간 큐 조회 추가
export const getActiveQueues = async () => {
  return api.get('/admin/active');
};
export const getQueueDetail = async (hostId: number) => {
  return api.get(`/admin/active/${hostId}`);
};