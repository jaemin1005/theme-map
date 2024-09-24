import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { LoginServiceRes } from '@/interface/login.dto';

// 로그인 핸들러 POST 메서드
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Actix Web 서버로 로그인 요청 전송
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json() as LoginServiceRes;
      
      // 리프레시 토큰을 HTTP-Only 쿠키로 설정
      const refreshTokenCookie = cookie.serialize("refreshToken", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // 1주일
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      const user = {
        id: data.user._id.$oid,
        email: data.user.email,
        name: data.user.name
      }

      // NextResponse에 쿠키 설정
      const res = NextResponse.json({ user, accessToken: data.access_token }, { status: 200 });
      res.headers.append("Set-Cookie", refreshTokenCookie);

      return res;
    } else {
      const errorData = await response.json();
      return NextResponse.json({ message: errorData.message }, { status: response.status });
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    return NextResponse.json({ message: "서버 내부 오류" }, { status: 500 });
  }
}
