import { NextResponse } from "next/server";
import { serialize } from "cookie";

// 1주일
const TIME = 60 * 60 * 24 * 7;

export const REFRESH_TOKEN = "refreshToken";

export const setUpRefreshToken = (res: NextResponse, refreshToken: string) => {
  const refreshTokenCookie = serialize(REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: TIME,
    path: "/",
  });

  res.headers.append("Set-Cookie", refreshTokenCookie);
};

export const initRefreshToken = (res: NextResponse) => {
  const refreshTokenCookie = serialize(REFRESH_TOKEN, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  res.headers.append("Set-Cookie", refreshTokenCookie);
}