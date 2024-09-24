import { NextResponse } from 'next/server';
import cookie from 'cookie';

// 로그아웃 핸들러
export async function POST() {
  // 토큰 쿠키 삭제
  const logoutCookie = cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), 
    path: '/',
  });

  // 응답에 Set-Cookie 헤더 추가하여 토큰 쿠키 삭제
  const res = NextResponse.json({ message: '로그아웃되었습니다.' }, { status: 200 });
  res.headers.append('Set-Cookie', logoutCookie);

  return res;
}