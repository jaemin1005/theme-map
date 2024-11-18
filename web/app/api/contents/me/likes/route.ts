import { ErrMsg } from "@/interface/err.dto";
import { INTERNAL_SERVER_ERROR, NONE_ACCESS_TOKEN } from "@/static/api/res";
import { checkAccessToken } from "@/utils/api/check_access_token";
import { GET_ENV, getEnv } from "@/utils/api/get_env";
import { NextRequest, NextResponse } from "next/server";

// 사용자 정보를 반환하는 핸들러 (GET 메서드)
export async function GET(req: NextRequest) {
  const authHeader = checkAccessToken(req);
  if (authHeader === false) {
    return NONE_ACCESS_TOKEN;
  }

  const CONTENT_SERVICE_URL = getEnv(GET_ENV.CONTENT_SERVICE_URL);

  try {
    // Actix Web 서버로 사용자 정보 요청 전송
    const response = await fetch(CONTENT_SERVICE_URL + "/map_me/likes", {
      method: "GET",
      headers: {
        Authorization: `${authHeader}`, // 액세스 토큰을 헤더에 포함
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    } else {
      const data = (await response.json()) as ErrMsg;
      console.error(data.message);
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error(error);
    return INTERNAL_SERVER_ERROR;
  }
}
