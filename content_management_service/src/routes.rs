use actix_web::web;

use crate::controllers::{map, search};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/map_save", web::post().to(map::map_save))
            .route("/map_me", web::get().to(map::map_me))
            .route("/map_read", web::post().to(map::map_read))
            .route("/map_remove", web::post().to(map::map_remove))
            .route("/search", web::get().to(search::search))
    );
}
