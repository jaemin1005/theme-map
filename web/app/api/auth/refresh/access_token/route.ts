import { INTERNAL_SERVER_ERROR, NONE_REFRESH_TOKEN } from "@/static/api/res";
import { GET_ENV, getEnv } from "@/utils/api/get_env";
import { REFRESH_TOKEN } from "@/utils/api/set_cookie";
import { NextRequest, NextResponse } from "next/server";

// 액세스 토큰 갱신 핸들러 (GET 메서드)
export async function GET(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NONE_REFRESH_TOKEN;
  }

  const AUTH_SERVICE_URL = getEnv(GET_ENV.AUTH_SERVICE_URL);

  try {
    // Actix Web 서버에 리프레시 토큰으로 액세스 토큰 갱신 요청
    const response = await fetch(AUTH_SERVICE_URL + "/api/auth/access_token", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `${REFRESH_TOKEN}=${refreshToken}`,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(error);
    return INTERNAL_SERVER_ERROR;
  }
}
