import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginReq {
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @IsString()
    password!: string
}