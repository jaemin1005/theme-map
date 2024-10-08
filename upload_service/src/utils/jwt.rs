use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::env;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // 사용자 ID
    pub exp: usize,  // 만료 시간
}

pub fn verify_access_token(
    token: &str,
) -> Result<jsonwebtoken::TokenData<Claims>, jsonwebtoken::errors::Error> {
    let secret = env::var("JWT_SECRET").unwrap_or_else(|_| "secret".into());

    decode_result(token, &secret)
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
