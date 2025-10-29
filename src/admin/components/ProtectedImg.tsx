import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/api";

interface ProtectedImgProps {
  path?: string;
  alt?: string;
  className?: string;
}

const ProtectedImg: React.FC<ProtectedImgProps> = ({ path, alt, className }) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    const fetchImage = async () => {
      if (!path) return;
      try {
        const token =
          sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken") || "";
        const response = await fetch(`${API_BASE_URL}${encodeURI(path)}`, {
          headers: { access: token }, // 🔑 Postman과 동일하게 access 헤더 사용
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        if (!cancelled) setSrc(objectUrl);
      } catch (err) {
        console.error("이미지 로드 실패:", err);
      }
    };

    fetchImage();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  if (!src)
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs bg-gray-100">
        No Image
      </div>
    );

  return <img src={src} alt={alt} className={className} />;
};

export default ProtectedImg;