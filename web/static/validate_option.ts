import { ValidatorOptions } from "class-validator";

export const validateOptions: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
}