import api from "../config/api";

interface JoinQueueRequest {
  phoneNumber: string;
  name: string;
  count: number;
}

interface JoinQueueResponse {
  status: string;
  index: string;
}

//활성화 큐 불러오는 임시 코드
export interface ActiveHost {
  id: number;
  name: string;
  count: number;
}

const GuestService = {
  joinQueue: async (
    id: string,
    data: JoinQueueRequest
  ): Promise<JoinQueueResponse> => {
    const response = await api.post<JoinQueueResponse>(`/queue/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  //활성화 큐 임시 코드
  getActiveQueues: async (): Promise<ActiveHost[]> => {
    const response = await api.get<any[]>("/admin/active");
    const mapped: ActiveHost[] = response.data.map((item) => ({
      id: item.id,
      name: item.name,
      count: item.count ?? 0,
    }));
    return mapped;
  },
};

export const getQueueDetail = async (
  hostId: number
): Promise<{ count: number }[]> => {
  const res = await api.get(`/admin/active/${hostId}`);
  return res.data;
};

export default GuestService;
