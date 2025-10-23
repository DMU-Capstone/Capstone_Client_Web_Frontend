import { apiRequest, apiGet, apiPost, apiDelete, apiPatch } from "../../utils/api";
import { errorUtils } from "../../utils/api";

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
export const getQueueDetail = async (hostId: number): Promise<{ count: number }[]> => {
  try {
    const res = await apiGet<{ count: number }[]>(`/admin/active/${hostId}`);
    // utils/api.ts의 apiGet은 ApiResponse<T>를 반환하므로 res.data에 실제 데이터가 있습니다.
    return res.data ?? [];
  } catch (e) {
    errorUtils.logError(e, "getQueueDetail");
    throw e;
  }
};


export const GuestService = {
  /**
   * 대기열에 게스트 등록 (호스트 ID 기반)
   * @param id 호스트 ID 또는 Queue ID
   * @param data 전화번호, 이름, 인원수
   * @returns 등록 결과 객체
   */
  joinQueue: async (id: string, data: JoinQueueRequest): Promise<JoinQueueResponse> => {
    try {
      const res = await apiPost<JoinQueueResponse>(`/queue/${id}`, data, {
        headers: { "Content-Type": "application/json" },
      });
      // ApiResponse<T> → 실제 응답 데이터만 반환해서 사용처에서 response.index 그대로 쓰게 함
      return res.data as JoinQueueResponse;
    } catch (e) {
      errorUtils.logError(e, "joinQueue");
      throw e;
    }
  },

  //활성화 큐 임시 코드
  getActiveQueues: async (): Promise<ActiveHost[]> => {
    try {
      const res = await apiGet<any[]>("/admin/active");
      const rows = res.data ?? [];
      const mapped: ActiveHost[] = rows.map((item: any) => ({
        id: item.id,
        name: item.name,
        count: item.count ?? 0,
      }));
      return mapped;
    } catch (e) {
      errorUtils.logError(e, "getActiveQueues");
      throw e;
    }
  },

  cancelQueue: async (queueId: string, data: JoinQueueRequest): Promise<void> => {
    try {
      await apiRequest(`/queue/${queueId}`, {
        method: "DELETE",
        body: data,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      errorUtils.logError(e, "cancelQueue");
      throw e;
    }
  },

  delayQueue: async (queueId: string, data: JoinQueueRequest): Promise<void> => {
    try {
      await apiPost(`/queue/${queueId}/postpone`, data, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      errorUtils.logError(e, "delayQueue");
      throw e;
    }
  },
};


export default GuestService;