// pages/api/auth/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';

interface User {
  id: string;
  name: string;
  email: string;
}

// 사용자 정보를 반환하는 핸들러
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: '허용되지 않는 메서드입니다.' });
  }

  // Authorization 헤더에서 액세스 토큰 가져오기
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 토큰이 없습니다.' });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    // Actix Web 서버로 사용자 정보 요청 전송
    const response = await fetch('http://localhost:8080/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`, // 액세스 토큰을 헤더에 포함
      },
    });

    if (response.ok) {
      const data: { user: User } = await response.json();
      res.status(200).json({ user: data.user });
    } else {
      res.status(response.status).json({ message: '사용자 정보를 가져올 수 없습니다.' });
    }
  } catch (error) {
    console.error('사용자 정보를 가져오는 중 오류 발생:', error);
    res.status(500).json({ message: '서버 내부 오류' });
  }
}
