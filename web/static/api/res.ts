import { ErrMsg } from "@/interface/err.dto";
import { NextResponse } from "next/server";
import { ERROR_MSG } from "../log/error_msg";

export const NONE_REFRESH_TOKEN = NextResponse.json<ErrMsg>(
  {
    message: ERROR_MSG.NONE_REFRESH_TOKEN,
  },
  {
    status: 401,
  }
)

export const NONE_ACCESS_TOKEN = NextResponse.json<ErrMsg>(
  {
    message: ERROR_MSG.NONE_ACCESS_TOKEN,
  },
  {
    status: 401,
  }
);

export const NONE_UNIQUE_URL_ID = NextResponse.json<ErrMsg>(
  {
    message: ERROR_MSG.NONE_UNIQUE_URL_ID,
  },
  {
    status: 400,
  }
)

export const FAILED_VALIDATE_BODY = NextResponse.json<ErrMsg>(
  {
    message: ERROR_MSG.FAILED_VALIDATE_BODY,
  },
  {
    status: 400,
  }
);

export const SIMPLE_OK_POST = new NextResponse(null, {
  status: 201,
});

export const SIMPLE_OK_GET = new NextResponse(null, {
  status: 200,
});

export const INTERNAL_SERVER_ERROR = new NextResponse(null, {
  status: 500,
})
