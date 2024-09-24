import { RegisterReq } from "@/interface/register.dto";
import { validateSync } from "class-validator";
import { ERROR_MSG } from "@/static/log/error_msg";
import { validateOptions } from "@/static/validate_option";
import { NextRequest, NextResponse } from "next/server";
import { plainToInstance } from 'class-transformer';
import { SUCCESS_MSG } from "@/static/log/success_msg";


export async function POST(req: NextRequest) {
  try {
    // 요청 본문에서 JSON 데이터를 추출
    const requestData = await req.json();

    // 유효성 검사
    const registerReq = plainToInstance(RegisterReq, requestData);
    const errors = validateSync(registerReq, validateOptions);

    if (errors.length > 0) {
      return NextResponse.json(
        { message: ERROR_MSG.REGISTER_VALIDATE_FAIL, details: errors.map(err => err.toString()) },
        { status: 400 }
      );
    }

    const { email, name, password } = registerReq;

    // Actix Web 서버로 등록 요청 전송
    // TODO 나중 NGINX 변경 가능성 존재 O 
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });

    if (response.ok) {
      return NextResponse.json({ message: SUCCESS_MSG.REGISTER_SUCCESS }, { status: 200 });
    } else {
      // 실패 시 Actix 서버에서의 에러 메시지 반환
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message }, { status: response.status });
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json(
      { message: ERROR_MSG.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}