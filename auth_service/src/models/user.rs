use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

// 유저 Collection 구조체 정의
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub name: String,
    pub email: String,
    pub password: String,
}

// 회원가입 요청 구조체 정의
#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub name: String,
    pub email: String,
    pub password: String,
}

// 로그인 요정 구조체 정의
#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

// 로그인 성공했을 때, 반환할 데이터 정의 (res.body)
#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub user: UserRes,
    pub access_token: String,
    pub refresh_token: String,
}

#[derive(Debug, Serialize)]
pub struct UserRes {
    pub name: String,
    pub email: String,
}
