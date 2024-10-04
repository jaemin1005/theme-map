use mongodb::{Client, Database, options::ClientOptions, error::Error};
use std::env;

// 데이터베이스 연결 함수
pub async fn get_database() -> Result<Database, Error> {
    // 환경 변수에서 MONGODB_URI를 가져오고, 없으면 기본값 사용
    let mongodb_uri = env::var("MONGODB_URI")
        .unwrap_or_else(|_| {
            println!("Warning: MONGODB_URI not set, using default URI 'mongodb://localhost:27017'");
            "mongodb://localhost:27017".to_string()
        });

    // 클라이언트 옵션을 파싱하고, 에러 발생 시 Result로 반환
    let client_options = ClientOptions::parse(&mongodb_uri).await?;

    // 클라이언트 생성, 에러 발생 시 Result로 반환
    let client = Client::with_options(client_options)?;

    // "auth_db" 데이터베이스에 연결된 클라이언트를 반환
    Ok(client.database("map_project"))
}
