use std::io;

use actix_web::{middleware::Logger, web, App, HttpServer};
use dotenv::dotenv;
use env_logger::Env;

mod routes;
mod end_points {
    pub mod auth;
}
mod services {
    pub mod auth_service;
}
mod models {
    pub mod err;
    pub mod refresh_token;
    pub mod user;
}
mod utils {
    pub mod db;
    pub mod jwt;
    pub mod password;
    pub mod user;
}

mod statics {
    pub mod err_msg;
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // .env 파일에서 환경 변수를 로드
    dotenv().ok();

    env_logger::init_from_env(Env::default().default_filter_or("info"));

    // 데이터베이스 연결을 가져온다.
    let db = match utils::db::get_database().await {
        Ok(database) => database,
        Err(e) => {
            eprintln!("Error connecting to the database: {}", e);
            return Err(io::Error::new(
                io::ErrorKind::Other,
                "Database connection failed",
            ));
        }
    };

    // HTTP 서버를 시작
    // 데이터베이스 연결을 공유
    // 라우터를 초기화
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .wrap(Logger::default())
            .configure(routes::init)
    })
    // 모든 IP에서 접근 가능하도록 설정
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
