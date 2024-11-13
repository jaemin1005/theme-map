import { INTERNAL_SERVER_ERROR } from "@/static/api/res";
import { GET_ENV, getEnv } from "@/utils/api/get_env";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search_type = searchParams.get("search_type");
  const body = searchParams.get("body");

  const CONTENT_SERVICE_URL = getEnv(GET_ENV.CONTENT_SERVICE_URL);

  const url = `${CONTENT_SERVICE_URL}/search?search_type=${search_type}&body=${body}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: req.headers.get("Authorization") || "",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
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
