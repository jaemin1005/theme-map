import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterReq {

    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}