// app/api/save-map/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MapSaveReq } from "@/interface/content.dto";
import { plainToInstance } from "class-transformer";
import { validateOptions } from "@/static/validate_option";
import { validateSync } from "class-validator";
import { ERROR_MSG } from "@/static/log/error_msg";
import { ErrMsg } from "@/interface/err.dto";

// https://stackoverflow.com/questions/66674834/how-to-read-formdata-in-nextjs
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }

  const body = await req.json();

  const mapSaveReq = plainToInstance(MapSaveReq, body);
  const errors = validateSync(mapSaveReq, validateOptions);

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
    const response = await fetch("http://localhost:3001/map_save", {
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
    console.error(ERROR_MSG.INTERNAL_SERVER_ERROR, error);
    return NextResponse.json(
      { message: ERROR_MSG.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
