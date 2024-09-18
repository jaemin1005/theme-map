import type { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

// 로그인 응답 인터페이스
interface LoginResponse {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  accessToken?: string;
  message?: string;
}

// 로그인 핸들러
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "허용되지 않는 메서드입니다." });
  }

  const { email, password } = req.body;

  try {
    // Actix Web 서버로 로그인 요청 전송
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();

      // 리프레시 토큰을 HTTP-Only 쿠키로 설정
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7 , 
          path: "/",
        })
      );

      res.status(200).json({ user: data.user, accessToken: data.accessToken });
    } else {
      const errorData = await response.json();
      res.status(response.status).json({ message: errorData.message });
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    res.status(500).json({ message: "서버 내부 오류" });
  }
}
