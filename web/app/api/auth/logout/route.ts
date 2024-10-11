import { NextResponse, NextRequest } from "next/server";
import { SUCCESS_MSG } from "@/static/log/success_msg";
import { ERROR_MSG } from "@/static/log/error_msg";
import { NONE_REFRESH_TOKEN } from "@/static/api/res";
import { initRefreshToken, REFRESH_TOKEN } from "@/utils/api/set_cookie";
import { GET_ENV, getEnv } from "@/utils/api/get_env";

// 로그아웃 핸들러
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NONE_REFRESH_TOKEN;
  }

  const AUTH_SERVICE_URL = getEnv(GET_ENV.AUTH_SERVICE_URL);

  try {
    // Actix Web 서버에 리프레시 토큰으로 액세스 토큰 갱신 요청
    const response = await fetch(AUTH_SERVICE_URL + "/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${REFRESH_TOKEN}=${refreshToken}`,
      },
    });
    if (response.ok) {
      // 응답에 Set-Cookie 헤더 추가하여 리프레시 토큰 쿠키 삭제
      const res = NextResponse.json(
        { message: SUCCESS_MSG.LOGOUT_SUCCESS },
        { status: 200 }
      );

      initRefreshToken(res);

      return res;
    } else {
      return NextResponse.json(
        { message: ERROR_MSG.LOGOUT_FAIL },
        { status: response.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: ERROR_MSG.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
