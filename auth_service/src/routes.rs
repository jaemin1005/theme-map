use actix_web::web;

use crate::end_points::auth;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/auth")
            .route("/register", web::post().to(auth::register))
            .route("/login", web::post().to(auth::login))
            .route("/refresh", web::post().to(auth::refresh))
            .route("/logout", web::post().to(auth::logout))
            .route("/me", web::get().to(auth::me))
            .route("/access_token", web::get().to(auth::refresh_aceess_token))
    );
}
