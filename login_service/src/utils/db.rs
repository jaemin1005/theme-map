use mongodb::{Client, Database, options::ClientOptions};
use std::env;

// 데이터베이스 연결 함수
pub async fn get_database() -> Database {
    let mongodb_uri = env::var("MONGODB_URI")
        .unwrap_or_else(|_| "mongodb://localhost:27017".to_string());

    let client_options = ClientOptions::parse(&mongodb_uri).await.unwrap();

    let client = Client::with_options(client_options).unwrap();

    client.database("auth_db")
}
