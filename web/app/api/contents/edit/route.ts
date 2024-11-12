// app/api/save-map/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MapSaveReq } from "@/interface/content.dto";
import { validateOptions } from "@/static/validate_option";
import { ErrMsg } from "@/interface/err.dto";
import { checkAccessToken } from "@/utils/api/check_access_token";
import {
  FAILED_VALIDATE_BODY,
  INTERNAL_SERVER_ERROR,
  NONE_ACCESS_TOKEN,
} from "@/static/api/res";
import { validateBody } from "@/utils/api/validate_body";
import { GET_ENV, getEnv } from "@/utils/api/get_env";

export async function POST(req: NextRequest) {
  const authHeader = checkAccessToken(req);
  if (authHeader === false) {
    return NONE_ACCESS_TOKEN;
  }

  const body = await validateBody(req, MapSaveReq, validateOptions);
  if (Array.isArray(body)) {
    return FAILED_VALIDATE_BODY;
  }

  const CONTENT_SERVICE_URL = getEnv(GET_ENV.CONTENT_SERVICE_URL);

  try {
    const response = await fetch(CONTENT_SERVICE_URL + "/map_edit", {
      method: "POST",
      headers: {
        Authorization: `${authHeader}`, // 액세스 토큰을 헤더에 포함
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
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
