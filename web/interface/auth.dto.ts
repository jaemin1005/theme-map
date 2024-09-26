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
    _id: { $oid: string }
    email: string
    name: string

    //! password는 빈값으로 들어올 예정
    password: string
}

// Actix_Web에서 Res 구조
export class LoginServiceRes {
    user!: LoginUserRes;
    refresh_token!: string;
    access_token!: string;
}

//#endregion

