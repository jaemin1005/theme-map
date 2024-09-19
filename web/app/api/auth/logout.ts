// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

// 로그아웃 핸들러
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 토큰 쿠키 삭제
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      path: '/',
    })
  );

  res.status(200).json({ message: '로그아웃되었습니다.' });
}