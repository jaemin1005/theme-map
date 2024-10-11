import { MapReadReq } from "@/interface/content.dto";
import {
  FAILED_VALIDATE_BODY,
  INTERNAL_SERVER_ERROR,
  NONE_ACCESS_TOKEN,
  SIMPLE_OK_POST,
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

  const body = await validateBody(req, MapReadReq, validateOptions);
  if (Array.isArray(body)) {
    return FAILED_VALIDATE_BODY;
  }

  const UPLOAD_SERVICE_URL = getEnv(GET_ENV.UPLOAD_SERVICE_URL);
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

    if (contentRes.ok === false) {
      return NextResponse.json(contentResJson, { status: contentRes.status });
    }

    const uploadRes = await fetch(UPLOAD_SERVICE_URL + "/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contentResJson),
    });

    if (uploadRes.ok) {
      return SIMPLE_OK_POST;
    }

    const uploadResJson = await uploadRes.json();
    return NextResponse.json(uploadResJson, { status: uploadRes.status });
  } catch (err) {
    return INTERNAL_SERVER_ERROR;
  }
}
