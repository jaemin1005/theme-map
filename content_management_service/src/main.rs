use actix_web::{web, App, HttpServer};
use dotenv::dotenv;
use std::io;
use utils::db;

mod controllers {
   pub mod map;
}

mod services {
    pub mod map_service;
}

mod models {
    pub mod err;
    pub mod map;
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

    // 세션을 시작하기 위한 client 생성 ()
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

    let db = db::get_database(&client_mongodb, "maps");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone()))
            .app_data(web::Data::new(client_mongodb.clone()))
            .configure(routes::init)
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
