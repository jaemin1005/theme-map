// models/refresh_token.rs
use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Serialize, Deserialize)]
pub struct RefreshToken {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>, // None일 경우 직렬화 스킵
    pub user_id: ObjectId,
    pub token: String,
    pub expiry: chrono::DateTime<chrono::Utc>,
}