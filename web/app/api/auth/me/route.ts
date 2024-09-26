import { convertUser } from '@/Func/convert_user';
import { LoginUserRes } from '@/interface/auth.dto';
import { NextRequest, NextResponse } from 'next/server';

// 사용자 정보를 반환하는 핸들러 (GET 메서드)
export async function GET(req: NextRequest) {
  // Authorization 헤더에서 액세스 토큰 가져오기
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: '인증 토큰이 없습니다.' }, { status: 401 });
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
      const data = await response.json() as LoginUserRes;
      const user = convertUser(data);
      return NextResponse.json(user, { status: 200 });
    } else {
      return NextResponse.json({ message: '사용자 정보를 가져올 수 없습니다.' }, { status: response.status });
    }
  } catch (error) {
    console.error('사용자 정보를 가져오는 중 오류 발생:', error);
    return NextResponse.json({ message: '서버 내부 오류' }, { status: 500 });
  }
}
