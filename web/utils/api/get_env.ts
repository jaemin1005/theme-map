import { ERROR_MSG } from "@/static/log/error_msg";

export enum GET_ENV {
  AUTH_SERVICE_URL= "AUTH_SERVICE_URL",
  CONTENT_SERVICE_URL = "CONTENT_SERVICE_URL",
  UPLOAD_SERVICE_URL = "UPLOAD_SERVICE_URL",
}

/**
 * 환경 변수의 값을 가져온다
 * 값이 없을 경우 Error throw
 * @param envPath 
 * @returns 
 */
export const getEnv = (envPath: GET_ENV): string => {
  const env = process.env[envPath];
  
  if(env === undefined){
    throw new Error(ERROR_MSG.FAILED_ENV_SETUP);
  }

  return env;
}