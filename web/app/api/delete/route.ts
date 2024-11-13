import { MapId } from "@/interface/content.dto";
import {
  FAILED_VALIDATE_BODY,
  INTERNAL_SERVER_ERROR,
  NONE_ACCESS_TOKEN,

} from "@/static/api/res";
import { validateOptions } from "@/static/validate_option";
import { checkAccessToken } from "@/utils/api/check_access_token";
import { GET_ENV, getEnv } from "@/utils/api/get_env";
import { validateBody } from "@/utils/api/validate_body";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authHeader = checkAccessToken(req);
  if (authHeader === false) {
    return NONE_ACCESS_TOKEN;
  }

  const body = await validateBody(req, MapId, validateOptions);
  if (Array.isArray(body)) {
    return FAILED_VALIDATE_BODY;
  }

  const CONTENT_SERVICE_URL = getEnv(GET_ENV.CONTENT_SERVICE_URL);

  try {
    const contentRes = await fetch(CONTENT_SERVICE_URL + "/map_remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authHeader}`,
      },
      body: JSON.stringify(body),
    });

    const contentResJson = await contentRes.json();
    return NextResponse.json(contentResJson, { status: contentRes.status });
  } catch (err) {
    return INTERNAL_SERVER_ERROR;
  }
}
