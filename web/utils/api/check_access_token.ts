import { NextRequest } from "next/server";

/**
 * Header의 authorization 항목을 검사하여 AccessToken이 존재하는지 검사
 * @param req
 * @returns
 */
export const checkAccessToken = (req: NextRequest) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  return authHeader;
};
