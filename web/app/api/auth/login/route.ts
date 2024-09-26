import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";
import { plainToInstance } from "class-transformer";
import { validateOptions } from "@/static/validate_option";
import { LoginReq, LoginServiceRes } from "@/interface/auth.dto";
import { validateSync } from "class-validator";
import { ERROR_MSG } from "@/static/log/error_msg";
import { convertUser } from "@/Func/convert_user";

// 로그인 핸들러 POST 메서드
export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    // 유효성 검사
    const loginReq = plainToInstance(LoginReq, requestData);
    const errors = validateSync(loginReq, validateOptions);

    if (errors.length > 0) {
      return NextResponse.json(
        {
          message: ERROR_MSG.REGISTER_VALIDATE_FAIL,
          details: errors.map((err) => err.toString()),
        },
        { status: 400 }
      );
    }

    const { email, password } = loginReq;

    // Actix Web 서버로 로그인 요청 전송
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = (await response.json()) as LoginServiceRes;

      // 리프레시 토큰을 HTTP-Only 쿠키로 설정
      const refreshTokenCookie = cookie.serialize(
        "refreshToken",
        data.refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          // 1주일
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        }
      );

      const user = convertUser(data.user);

      // NextResponse에 쿠키 설정
      const res = NextResponse.json(
        { user, accessToken: data.access_token },
        { status: 200 }
      );
      res.headers.append("Set-Cookie", refreshTokenCookie);

      return res;
    } else {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}
