export type ISODateTime = string;

export interface CreateHostRequest {
  request: {
    hostName: string;
    maxPeople: number;
    hostManagerName: string;
    hostPhoneNumber: string;
    latitude: number;
    longitude: number;
    keyword: string;        // 여러 개면 ","로 합쳐서 보냄
    description: string;
    startTime: ISODateTime; // ISO 8601
    endTime: ISODateTime;   // ISO 8601
  };
  hostImages: string[];     // base64 또는 URL 문자열(스웨거상 string[])
}

export type CreateHostResponse = any; // Swagger에 응답 명세가 없어 임시

// 파일 -> base64(dataURL)
export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const filesToBase64 = async (files: File[]) =>
  Promise.all(files.map(fileToBase64));