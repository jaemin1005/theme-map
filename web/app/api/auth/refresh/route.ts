import { NextRequest, NextResponse } from 'next/server';
import cookie from 'cookie';
import { LoginServiceRes } from '@/interface/login.dto';
import { convertUser } from '@/Func/convert_user';

// 액세스 토큰 갱신 핸들러 (POST 메서드)
export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: '인증되지 않았습니다.' }, { status: 401 });
  }

  try {
    // Actix Web 서버에 리프레시 토큰으로 액세스 토큰 갱신 요청
    const response = await fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `refreshToken=${refreshToken}`,  // 쿠키에 리프레시 토큰 추가
      },
    });

    if (response.ok) {
      const data = await response.json() as LoginServiceRes;
      const user = convertUser(data.user);

      // 새로운 리프레시 토큰이 있으면 쿠키에 다시 저장
      if (data.refresh_token) {
        const refreshTokenCookie = cookie.serialize('refreshToken', data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7, // 7일
          path: '/',
        });

        const res = NextResponse.json({ user, accessToken: data.access_token }, { status: 200 });
        res.headers.append('Set-Cookie', refreshTokenCookie);
        return res;
      }

      return NextResponse.json({ user, accessToken: data.access_token }, { status: 200 });
    } else {
      return NextResponse.json({ message: '리프레시 토큰이 유효하지 않습니다.' }, { status: 401 });
    }
  } catch (error) {
    console.error('액세스 토큰 갱신 중 오류 발생:', error);
    return NextResponse.json({ message: '서버 내부 오류' }, { status: 500 });
  }
}
