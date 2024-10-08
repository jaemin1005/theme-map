import { MapReadReq } from "@/interface/content.dto";
import { ERROR_MSG } from "@/static/log/error_msg";
import { validateOptions } from "@/static/validate_option";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Authorization 헤더에서 액세스 토큰 가져오기
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }

  const requestData = await req.json();

  // 유효성 검사를 진행
  const mapReadReq = plainToInstance(MapReadReq, requestData);
  const errors = validateSync(mapReadReq, validateOptions);

  if (errors.length > 0) {
    return NextResponse.json(
      {
        message: ERROR_MSG.REGISTER_VALIDATE_FAIL,
        details: errors.map((err) => err.toString()),
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("http://localhost:3001/map_read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authHeader}`,
      },
      body: JSON.stringify(mapReadReq),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: data.status });
  } catch (error) {
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error);
    return NextResponse.json(
      { message: ERROR_MSG.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
