use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // 사용자 ID
    pub exp: usize,  // 만료 시간
}

// access 토큰 생성
pub fn create_access_token(user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
    // .env의 환경변수에서 JWT_SECRET을 읽는다.
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());

    let expiration = Utc::now()
        .checked_add_signed(Duration::minutes(15))
        .expect("유효한 시간")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration,
    };

    encode_result(&claims, &secret)
}

// refresh 토큰 생성
pub fn create_refresh_token(user_id: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let secret = env::var("JWT_REFRESH_SECRET").unwrap_or_else(|_| "refresh_secret".into());

    let expiration = Utc::now()
        .checked_add_signed(Duration::days(7))
        .expect("유효한 시간")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration,
    };

    encode_result(&claims, &secret)
}

pub fn verify_access_token(
    token: &str,
) -> Result<jsonwebtoken::TokenData<Claims>, jsonwebtoken::errors::Error> {
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());

    decode_result(token, &secret)
}

pub fn verify_refresh_token(
    token: &str,
) -> Result<jsonwebtoken::TokenData<Claims>, jsonwebtoken::errors::Error> {
    let secret = env::var("JWT_REFRESH_SECRET").unwrap_or_else(|_| "refresh_secret".into());

    decode_result(token, &secret)
}

// jsonwebtoken 라이브러리를 사용
// JWT 토큰을 만드는 과정
fn encode_result<T: Serialize>(claims: &T, key: &str) -> Result<String, jsonwebtoken::errors::Error> {
    encode(
        // JWT의 헤더 부분, Header::default()를 사용하면 기본적으로 typ는 "JWT"로 설정되고, alg는 "HS256" (HMAC SHA-256)으로 설정
        &Header::default(),
        claims,
        // 토큰을 서명하기 위한 비밀 키
        &EncodingKey::from_secret(key.as_bytes()),
    )
}

// jwt를 디코딩하는 함수
// 토큰이 유효하면, 토큰에 포함된 정보를 반환, 토큰이 유효하지 않으면 에러를 반환합니다
fn decode_result<T: DeserializeOwned>(
    token: &str,
    key: &str,
) -> Result<jsonwebtoken::TokenData<T>, jsonwebtoken::errors::Error> {
    decode::<T>(
        token,
        &DecodingKey::from_secret(key.as_bytes()),
        // 기본적인 검증 규칙을 지정
        // 토큰의 서명과 유효 기간을 확인
        &Validation::default(),
    )
}
