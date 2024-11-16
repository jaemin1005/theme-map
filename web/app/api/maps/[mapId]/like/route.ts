// app/api/save-map/route.ts

import { NextRequest, NextResponse } from "next/server";
import { ErrMsg } from "@/interface/err.dto";
import { checkAccessToken } from "@/utils/api/check_access_token";
import {
  INTERNAL_SERVER_ERROR,
  NONE_ACCESS_TOKEN,
  NONE_UNIQUE_URL_ID,
} from "@/static/api/res";
import { GET_ENV, getEnv } from "@/utils/api/get_env";

export async function POST(
  req: NextRequest,
  { params }: { params: { mapId: string } }
) {
  const authHeader = checkAccessToken(req);
  if (authHeader === false) {
    return NONE_ACCESS_TOKEN;
  }

  const { mapId } = params;
  if (!mapId) {
    return NONE_UNIQUE_URL_ID;
  }

  const CONTENT_SERVICE_URL = getEnv(GET_ENV.CONTENT_SERVICE_URL);

  try {
    const response = await fetch(`${CONTENT_SERVICE_URL}/maps/${mapId}/like`, {
      method: "POST",
      headers: {
        Authorization: `${authHeader}`,
      },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { mapId: string } }
) {
  const { mapId } = params;

  if (!mapId) {
    return NONE_UNIQUE_URL_ID;
  }

  const authHeader = checkAccessToken(req);
  if (authHeader === false) {
    return NONE_ACCESS_TOKEN;
  }

  const CONTENT_SERVICE_URL = getEnv(GET_ENV.CONTENT_SERVICE_URL);

  try {
    const response = await fetch(`${CONTENT_SERVICE_URL}/maps/${mapId}/like`, {
      method: "DELETE",
      headers: {
        Authorization: `${authHeader}`,
      },
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
