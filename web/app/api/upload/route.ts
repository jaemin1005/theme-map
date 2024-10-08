import { ERROR_MSG } from '@/static/log/error_msg';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false, // 스트림 방식으로 보낼 것이므로 bodyParser를 비활성화
  },
};

export async function POST(req: NextRequest) {

  const formData = await req.formData();

  try {
    const response = await fetch('http://localhost:3002/upload', {
      method: 'POST',
      body: formData,
    });
      const result = await response.json();
      return NextResponse.json(result, {status: result.status});
  } catch (error) {
    return NextResponse.json({ message: ERROR_MSG.INTERNAL_SERVER_ERROR }, { status: 500 });
  }
}