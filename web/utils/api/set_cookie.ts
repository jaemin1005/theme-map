import { NextResponse } from "next/server";
import { serialize } from "cookie";

// 1주일
const TIME = 60 * 60 * 24 * 7;

export const setUpRefreshToken = (res: NextResponse, refreshToken: string) => {
  const refreshTokenCookie = serialize(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: TIME,
      path: "/",
    }
  );

  res.headers.append("Set-Cookie", refreshTokenCookie);
}