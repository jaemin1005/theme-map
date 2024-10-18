import { INTERNAL_SERVER_ERROR } from "@/static/api/res";
import { GET_ENV, getEnv } from "@/utils/api/get_env";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const UPLOAD_SERVICE_URL = getEnv(GET_ENV.UPLOAD_SERVICE_URL);

  try {
    const response = await fetch(UPLOAD_SERVICE_URL + "/upload", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    return NextResponse.json(result, { status: result.status });
  } catch (error) {
    return INTERNAL_SERVER_ERROR;
  }
}
