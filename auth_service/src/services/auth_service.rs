use actix_web::HttpRequest;
use chrono::{Duration, Utc};
use mongodb::{bson::doc, bson::oid::ObjectId, Database};

use crate::models::app_err::AppError;
use crate::models::refresh_token::{AccessTokenRes, RefreshToken};
use crate::models::user::{LoginRequest, LoginResponse, RegisterRequest, User, UserRes};
use crate::utils::{jwt, password};

// 유저 회원가입
pub async fn register_user(
    register_info: RegisterRequest,
    db: &Database,
) -> Result<UserRes, AppError> {
    let users = db.collection::<User>("users");

    // 이메일 중복 확인
    if users
        .find_one(doc! { "email": &register_info.email }, None)
        .await?
        .is_some()
    {
        return Err(AppError::EmailAlreadyExists);
    }

    // 비밀번호 해싱
    let hashed_password = password::hash_password(&register_info.password)?;

    // 새로운 사용자 생성
    let new_user = User {
        id: None,
        name: register_info.name,
        email: register_info.email,
        password: hashed_password,
    };

    // 데이터베이스에 사용자 삽입
    let insert_result = users.insert_one(new_user, None).await?;

    // 삽입된 사용자의 ID 가져오기
    let user_id = insert_result
        .inserted_id
        .as_object_id() // Bson을 ObjectId로 변환
        .ok_or(AppError::UserNotFound)?;

    // 데이터베이스에서 사용자 조회
    let user = users
        .find_one(doc! { "_id": user_id.clone() }, None)
        .await?
        .ok_or(AppError::UserNotFound)?;

    Ok(UserRes {
        email: user.email,
        name: user.name,
    })
}

// 유저 로그인
pub async fn login_user(
    login_info: LoginRequest,
    device_id: &str,
    db: &Database,
) -> Result<LoginResponse, AppError> {
    let users = db.collection::<User>("users");

    // 이메일로 사용자 조회
    let user = users
        .find_one(doc! { "email": &login_info.email }, None)
        .await?
        .ok_or(AppError::InvalidCredentials)?;

    // 비밀번호 검증
    if !password::verify_password(&login_info.password, &user.password)? {
        return Err(AppError::InvalidCredentials);
    }

    let user_id = user.id.as_ref().unwrap().to_hex();

    // _id를 이용한 액세스 및 리프레시 토큰 생성
    let access_token = jwt::create_access_token(&user_id)?;
    let refresh_token = jwt::create_refresh_token(&user_id)?;

    // 리프레시 토큰을 데이터베이스에 저장
    // 컬랙션 접근
    let refresh_tokens = db.collection::<RefreshToken>("refresh_tokens");

    let obejct_id_user = ObjectId::parse_str(&user_id)?;

    let set_time = Utc::now() + Duration::days(7);

    let new_refresh_token = RefreshToken {
        id: None,
        user_id: obejct_id_user,
        device_id: device_id.to_string(),
        token: refresh_token.clone(),
        expiry: set_time,
    };

    let update = doc! {
        "$set": {
            "token": refresh_token.clone(),
            "expiry": set_time.to_rfc3339(),
        }
    };

    let filter_find_id = doc! {"user_id": obejct_id_user, "device_id": device_id};

    match refresh_tokens
        .find_one(filter_find_id.clone(), None)
        .await?
    {
        Some(_) => {
            refresh_tokens
                .update_one(filter_find_id, update, None)
                .await?;
        }
        None => {
            refresh_tokens.insert_one(new_refresh_token, None).await?;
        }
    }

    // 응답 반환
    Ok(LoginResponse {
        user: UserRes {
            email: user.email,
            name: user.name,
        },
        access_token,
        refresh_token,
    })
}

// 리프레시 토큰 재생성
// 1. 리프레시 토큰 유출 방지, 2. 권한 해제 및 세션 종료 관리
pub async fn refresh_token(
    req: &HttpRequest,
    device_id: &str,
    db: &Database,
) -> Result<LoginResponse, AppError> {
    let refresh_token =
        extract_refresh_token_from_request(req).map_err(|_| AppError::MissingRefreshToken)?;

    let token_data = jwt::verify_refresh_token(&refresh_token)?;

    let user_id = token_data.claims.sub;

    let refresh_tokens = db.collection::<RefreshToken>("refresh_tokens");
    let filter = doc! { "user_id": ObjectId::parse_str(&user_id)?, "token": &refresh_token, "device_id": device_id };

    // 토큰이 존재하는지 확인
    let stored_token = refresh_tokens.find_one(filter.clone(), None).await?;

    // 해당 토큰이 db에 존재하지 않을 떄
    if stored_token.is_none() {
        return Err(AppError::TokenNotFound);
    }

    // 새로운 토큰 생성, 리프레쉬 토큰 재생성
    let access_token = jwt::create_access_token(&user_id)?;
    let new_refresh_token = jwt::create_refresh_token(&user_id)?;

    let update = doc! {
        "$set": {
            "token": &new_refresh_token,
            "device_id": device_id,
            "expiry": (Utc::now() + Duration::days(7)).to_rfc3339(),        }
    };

    // 재생성한 리프레시 토큰 업데이트
    refresh_tokens.update_one(filter, update, None).await?;

    let user = get_user_by_id(&user_id, db).await?;

    Ok(LoginResponse {
        user: UserRes {
            email: user.email,
            name: user.name,
        },
        access_token,
        refresh_token: new_refresh_token,
    })
}

pub async fn refresh_aceess_token(
    req: &HttpRequest,
    device_id: &str,
    db: &Database,
) -> Result<AccessTokenRes, AppError> {
    let refresh_token = extract_refresh_token_from_request(req)?;

    let token_data = jwt::verify_refresh_token(&refresh_token)?;

    let user_id = token_data.claims.sub;

    let refresh_tokens = db.collection::<RefreshToken>("refresh_tokens");
    let filter = doc! { "user_id": ObjectId::parse_str(&user_id)?, "token": &refresh_token, "device_id": device_id};

    // 토큰이 존재하는지 확인
    let stored_token = refresh_tokens.find_one(filter, None).await?;

    if stored_token.is_none() {
        return Err(AppError::TokenNotFound);
    }

    let access_token = jwt::create_access_token(&user_id)?;

    Ok(AccessTokenRes { access_token })
}

// 토큰을 이용해, 해재함으로 인해 권한 해제 및 세션 종료 관리가 가능
pub async fn logout_user(req: &HttpRequest, db: &Database) -> Result<(), AppError> {
    // 클라이언트로부터 리프레시 토큰 가져오기
    let refresh_token = extract_refresh_token_from_request(req)?;

    // 데이터베이스에서 리프레시 토큰 삭제
    let refresh_tokens = db.collection::<RefreshToken>("refresh_tokens");
    let filter = doc! { "token": &refresh_token };
    refresh_tokens.delete_one(filter, None).await?;

    Ok(())
}

pub async fn get_user_info(req: &HttpRequest, db: &Database) -> Result<User, AppError> {
    // Authorization 헤더에서 액세스 토큰 추출
    let auth_header = req
        .headers()
        .get("Authorization")
        .ok_or(AppError::InvalidAuthorizationHeader)?
        .to_str()?;

    if !auth_header.starts_with("Bearer ") {
        return Err(AppError::InvalidAuthorizationHeader)?;
    }

    let token = &auth_header[7..]; // "Bearer " 부분 제거

    // 액세스 토큰 검증
    let token_data = jwt::verify_access_token(token)?;

    let user_id = token_data.claims.sub;

    // 데이터베이스에서 사용자 조회
    let user = get_user_by_id(&user_id, db).await?;

    Ok(user)
}

// _id를 통해 유저 정보를 가져온다
async fn get_user_by_id(user_id: &str, db: &Database) -> Result<User, AppError> {
    let users = db.collection::<User>("users");

    let object_id = ObjectId::parse_str(user_id)?;

    let user = users
        .find_one(doc! { "_id": object_id }, None)
        .await?
        .ok_or(AppError::UserNotFound)?;

    Ok(User {
        id: user.id,
        name: user.name,
        email: user.email,
        password: "".to_string(), // 비밀번호는 반환하지 않음
    })
}

// 요청으로 부터 리프레쉬 토큰을 추출한다.
fn extract_refresh_token_from_request(req: &HttpRequest) -> Result<String, AppError> {
    if let Some(cookie) = req.cookie("refreshToken") {
        Ok(cookie.value().to_string())
    } else {
        Err(AppError::MissingRefreshToken)
    }
}