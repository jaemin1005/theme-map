use actix_web::{web, App, HttpServer};
use aws_config::BehaviorVersion;
use aws_sdk_s3::Client;
use dotenv::dotenv;

pub mod controllers {
    pub mod upload;
}

pub mod utils {
    pub mod jwt;
}

pub mod services {
    pub mod upload_service;
}

pub mod models {
    pub mod upload_model;
    pub mod err;
}

pub mod statics {
    pub mod err_msg;
}

pub mod routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    //세션을 시작하기 위한 client 생성 ()
    let config = aws_config::defaults(BehaviorVersion::latest()).load().await;
    let s3_client = Client::new(&config);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(s3_client.clone()))
            .configure(routes::init)
    })
    .bind("127.0.0.1:3002")?
    .run()
    .await
}