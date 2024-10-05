// models/refresh_token.rs
use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;

// MongoDB에서 리프레시 토큰을 관리하기 위해 RefreshToken 구조체를 정의
#[derive(Debug, Serialize, Deserialize)]
pub struct RefreshToken {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>, // None일 경우 직렬화 스킵
    pub user_id: ObjectId,
    pub token: String,
    pub expiry: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Serialize)]
pub struct AccessTokenRes {
    pub access_token: String
}