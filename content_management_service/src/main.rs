use actix_web::{middleware::Logger, web, App, HttpServer};
use dotenv::dotenv;
use env_logger::Env;
use std::io;
use utils::db;

mod controllers {
    pub mod map;
    pub mod search;
}

mod services {
    pub mod map_service;
    pub mod search_service;
    pub mod user_service;
}

mod models {
    pub mod err;
    pub mod map;
    pub mod upload_model;
    pub mod user;
    pub mod search_model;
}

mod utils {
    pub mod db;
    pub mod get_user_info;
    mod jwt;
}

mod statics {
    pub mod err_msg;
}

mod routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init_from_env(Env::default().default_filter_or("info"));

    //세션을 시작하기 위한 client 생성 ()
    let client_mongodb = match utils::db::get_client().await {
        Ok(client) => client,
        Err(e) => {
            eprintln!("Error connecting to the database: {}", e);
            return Err(io::Error::new(
                io::ErrorKind::Other,
                "Database connection failed",
            ));
        }
    };

    let db = db::get_database(&client_mongodb, "map_project");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .app_data(web::Data::new(client_mongodb.clone()))
            .wrap(Logger::default())
            .configure(routes::init)
    })
    .bind("0.0.0.0:3001")?
    .run()
    .await
}
