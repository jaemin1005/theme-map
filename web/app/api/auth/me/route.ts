import { LoginUserRes } from "@/interface/auth.dto";
import { INTERNAL_SERVER_ERROR, NONE_ACCESS_TOKEN } from "@/static/api/res";
import { ERROR_MSG } from "@/static/log/error_msg";
import { checkAccessToken } from "@/utils/api/check_access_token";
import { GET_ENV, getEnv } from "@/utils/api/get_env";
import { NextRequest, NextResponse } from "next/server";

// 사용자 정보를 반환하는 핸들러 (GET 메서드)
export async function GET(req: NextRequest) {
  // Authorization 헤더에서 액세스 토큰 가져오기
  const authHeader = checkAccessToken(req);
  if (authHeader === false) {
    return NONE_ACCESS_TOKEN;
  }

  const AUTH_SERVICE_URL = getEnv(GET_ENV.AUTH_SERVICE_URL);

  try {
    // Actix Web 서버로 사용자 정보 요청 전송
    const response = await fetch(AUTH_SERVICE_URL + "/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: authHeader, // 액세스 토큰을 헤더에 포함
      },
    });

    if (response.ok) {
      const data = (await response.json()) as LoginUserRes;
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json(
        { message: ERROR_MSG.FAILED_GET_USER_INFO },
        { status: response.status }
      );
    }
  } catch (error) {
    return INTERNAL_SERVER_ERROR;
  }
}
