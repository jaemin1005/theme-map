use actix_web::{App, HttpServer};
use dotenv::dotenv;

mod routes;
mod end_points {
    pub mod auth;
}
mod services {
    pub mod auth_service;
}
mod models {
    pub mod user;
    pub mod refresh_token;
}
mod utils {
    pub mod jwt;
    pub mod password;
    pub mod db;
}


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // .env 파일에서 환경 변수를 로드
    dotenv().ok();

    // 데이터베이스 연결을 가져온다.
    let db = utils::db::get_database().await;

    // HTTP 서버를 시작
    // 데이터베이스 연결을 공유
    // 라우터를 초기화
    HttpServer::new(move || {
        App::new()
            .app_data(db.clone())
            .configure(routes::init)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
