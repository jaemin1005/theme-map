import { plainToInstance } from "class-transformer";
import { validate, ValidatorOptions } from "class-validator";
import { NextRequest } from "next/server";

/**
 * req, body의 validate 검사
 * @param req : 요청
 * @param classType : 어떤 classType으로 검사할 것인가?
 * @param validateOptions : 유효성검사 옵션
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const validateBody = async <T extends Object>(
  req: NextRequest,
  classType: new () => T,
  validateOptions: ValidatorOptions
): Promise<T | string[]> => {
  const body = (await req.json()) as T;

  const instance = plainToInstance(classType, body);
  const errors = await validate(instance, validateOptions);

  if (errors.length > 0) {
    return errors.map((err) => err.toString());
  }

  return body;
};
