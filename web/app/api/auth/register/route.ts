import { RegisterReq } from "@/interface/auth.dto";
import { validateOptions } from "@/static/validate_option";
import { NextRequest, NextResponse } from "next/server";
import { SUCCESS_MSG } from "@/static/log/success_msg";
import { FAILED_VALIDATE_BODY, INTERNAL_SERVER_ERROR } from "@/static/api/res";
import { validateBody } from "@/utils/api/validate_body";
import { GET_ENV, getEnv } from "@/utils/api/get_env";

export async function POST(req: NextRequest) {
  try {
    const body = await validateBody(req, RegisterReq, validateOptions);
    if (Array.isArray(body)) {
      return FAILED_VALIDATE_BODY;
    }

    const AUTH_SERVICE_URL = getEnv(GET_ENV.AUTH_SERVICE_URL);

    // Actix Web 서버로 등록 요청 전송
    // TODO 나중 NGINX 변경 가능성 존재 O
    const response = await fetch(AUTH_SERVICE_URL + "/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return NextResponse.json(
        { message: SUCCESS_MSG.REGISTER_SUCCESS },
        { status: 200 }
      );
    } else {
      // 실패 시 Actix 서버에서의 에러 메시지 반환
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error(error);
    return INTERNAL_SERVER_ERROR;
  }
}
