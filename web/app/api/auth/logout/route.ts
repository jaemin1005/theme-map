import { NextResponse, NextRequest } from "next/server";
import cookie from "cookie";
import { SUCCESS_MSG } from "@/static/log/success_msg";
import { ERROR_MSG } from "@/static/log/error_msg";

// 로그아웃 핸들러
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: ERROR_MSG.NO_REFRESH_TOKEN },
      { status: 401 }
    );
  }

  try {
    // Actix Web 서버에 리프레시 토큰으로 액세스 토큰 갱신 요청
    const response = await fetch("http://localhost:8080/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    if (response.ok) {
      // 만료시간을 과거로 설정하여 쿠키 삭제
      const refreshTokenCookie = cookie.serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), 
        path: "/",
      });

      // 응답에 Set-Cookie 헤더 추가하여 리프레시 토큰 쿠키 삭제
      const res = NextResponse.json(
        { message: SUCCESS_MSG.LOGOUT_SUCCESS },
        { status: 200 }
      );
      res.headers.append("Set-Cookie", refreshTokenCookie);
      
      return res
    } else {
      return NextResponse.json(
        { message: ERROR_MSG.LOGOUT_FAIL },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR);
    return NextResponse.json({ message: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
