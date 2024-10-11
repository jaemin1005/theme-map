import { NextRequest, NextResponse } from "next/server";
import { LoginServiceRes } from "@/interface/auth.dto";
import { REFRESH_TOKEN, setUpRefreshToken } from "@/utils/api/set_cookie";
import { INTERNAL_SERVER_ERROR, NONE_REFRESH_TOKEN } from "@/static/api/res";
import { GET_ENV, getEnv } from "@/utils/api/get_env";

// 액세스 토큰 갱신 핸들러 (POST 메서드)
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_TOKEN)?.value;

  if (!refreshToken) {
    return NONE_REFRESH_TOKEN;
  }

  const AUTH_SERVICE_URL = getEnv(GET_ENV.AUTH_SERVICE_URL);

  try {
    // Actix Web 서버에 리프레시 토큰으로 액세스 토큰 갱신 요청
    const response = await fetch(AUTH_SERVICE_URL + "/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (response.ok) {
      const data = (await response.json()) as LoginServiceRes;

      // 새로운 리프레시 토큰이 있으면 쿠키에 다시 저장
      if (data.refresh_token) {
        const res = NextResponse.json(
          { user: data.user, accessToken: data.access_token },
          { status: 200 }
        );

        setUpRefreshToken(res, data.refresh_token);

        return res;
      }

      return NextResponse.json(
        { user: data.user, accessToken: data.access_token },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "리프레시 토큰이 유효하지 않습니다." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error(error);
    return INTERNAL_SERVER_ERROR;
  }
}
