import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

// 리프레시 응답 인터페이스
interface RefreshResponse {
  user?: {
    id: string;
    name: string;
    email: string;
  };
  accessToken?: string;
  message?: string;
}

// 액세스 토큰 갱신 핸들러
export default async function handler(req: NextApiRequest, res: NextApiResponse<RefreshResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: '인증되지 않았습니다.' });
  }

  try {
    // Actix Web 서버에 리프레시 토큰으로 액세스 토큰 갱신 요청
    const response = await fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();

      // 새로운 리프레시 토큰이 있으면 쿠키에 다시 저장
      if (data.refreshToken) {
        res.setHeader(
          'Set-Cookie',
          cookie.serialize('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7일
            path: '/',
          })
        );
      }

      // 새로운 액세스 토큰을 반환
      res.status(200).json({ user: data.user, accessToken: data.accessToken });
    } else {
      res.status(401).json({ message: '리프레시 토큰이 유효하지 않습니다.' });
    }
  } catch (error) {
    console.error('액세스 토큰 갱신 중 오류 발생:', error);
    res.status(500).json({ message: '서버 내부 오류' });
  }
}
