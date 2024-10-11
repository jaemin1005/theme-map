import { ErrMsg } from "@/interface/err.dto";
import { NextResponse } from "next/server";
import { ERROR_MSG } from "../log/error_msg";

export const NONE_ACCESS_TOKEN = NextResponse.json<ErrMsg>(
  {
    message: ERROR_MSG.NONE_ACCESS_TOKEN,
  },
  {
    status: 401,
  }
);

export const FAILED_VALIDATE_BODY = NextResponse.json<ErrMsg>(
  {
    message: ERROR_MSG.FAILED_VALIDATE_BODY,
  },
  {
    status: 400,
  }
);
