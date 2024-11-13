use actix_web::{middleware::Logger, web, App, HttpServer};
use aws_config::BehaviorVersion;
use aws_sdk_s3::Client;
use dotenv::dotenv;
use env_logger::Env;

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
    pub mod app_err;
    pub mod upload_model;
    pub mod err;
}

pub mod routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    //세션을 시작하기 위한 client 생성 ()
    let config = aws_config::defaults(BehaviorVersion::latest()).load().await;
    let s3_client = Client::new(&config);

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(s3_client.clone()))
            .wrap(Logger::default())
            .configure(routes::init)
    })
    .bind("0.0.0.0:3002")?
    .run()
    .await
}