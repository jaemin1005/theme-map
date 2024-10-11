import { NextRequest, NextResponse } from "next/server";
import { validateOptions } from "@/static/validate_option";
import { LoginReq, LoginServiceRes } from "@/interface/auth.dto";
import { FAILED_VALIDATE_BODY, INTERNAL_SERVER_ERROR } from "@/static/api/res";
import { validateBody } from "@/utils/api/validate_body";
import { GET_ENV, getEnv } from "@/utils/api/get_env";
import { setUpRefreshToken } from "@/utils/api/set_cookie";

// 로그인 핸들러 POST 메서드
export async function POST(req: NextRequest) {
  const body = await validateBody(req, LoginReq, validateOptions);
  if (Array.isArray(body)) {
    return FAILED_VALIDATE_BODY;
  }

  const AUTH_SERVICE_URL = getEnv(GET_ENV.AUTH_SERVICE_URL);

  try {
    // Actix Web 서버로 로그인 요청 전송
    const response = await fetch(AUTH_SERVICE_URL + "/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = (await response.json()) as LoginServiceRes;

      const res = NextResponse.json(
        { user: data.user, accessToken: data.access_token },
        { status: 200 }
      );

      setUpRefreshToken(res, data.refresh_token);

      return res;
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    return INTERNAL_SERVER_ERROR;
  }
}
