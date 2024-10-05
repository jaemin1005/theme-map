import { ERROR_MSG } from "@/static/log/error_msg";
import { NextRequest, NextResponse } from "next/server";

// 액세스 토큰 갱신 핸들러 (GET 메서드)
export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "인증되지 않았습니다." },
      { status: 401 }
    );
  }

  try {
    // Actix Web 서버에 리프레시 토큰으로 액세스 토큰 갱신 요청
    const response = await fetch(
      "http://localhost:8080/api/auth/access_token",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
      }
    );

    const data = (await response.json());
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error("액세스 토큰 갱신 중 오류 발생:", error);
    return NextResponse.json({ message: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
