import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from './user';

export class LoginReq {
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @IsNotEmpty()
    @IsString()
    password!: string
}

// TODO 고민 X, 
export interface LoginRes {
    user: User,
    
}

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


//#region --login_service--

export interface LoginUserRes {
    email: string
    name: string
}

// Actix_Web에서 Res 구조
export class LoginServiceRes {
    user!: LoginUserRes;
    refresh_token!: string;
    access_token!: string;
}

//#endregion

// access_token 재발급 객체
export class AccessTokenRes {
    access_token!: string;
}