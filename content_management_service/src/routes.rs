use actix_web::web;

use crate::controllers::map;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/api/contents")
            .route("/map_save", web::post().to(map::map_save))
    );
}
