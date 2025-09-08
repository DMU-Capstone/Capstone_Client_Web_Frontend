import axios from "axios";

const LoginPage = () => {
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://134.185.99.89:8080/login",
        {
          username: "010-1234-1234",
          password: "1234",
        },
        {
          withCredentials: true, // 쿠키도 포함 (refresh 쿠키 받기 위함)
        }
      );

      console.log("🟢 전체 응답:", response);
      console.log("🟢 응답 헤더:", response.headers);

      const authHeader = response.headers["authorization"];
      if (authHeader) {
        const token = authHeader.split(" ")[1]; // "Bearer xxx" → "xxx"
        console.log("✅ access 토큰:", token);
      } else {
        console.warn("❌ Authorization 헤더가 없습니다");
      }
    } catch (error) {
      console.error("❌ 로그인 요청 실패", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-2xl font-bold">로그인 페이지</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        로그인 요청 보내기
      </button>
    </div>
  );
};

export default LoginPage;
