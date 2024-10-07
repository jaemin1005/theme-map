use actix_web::web;


use crate::controllers::upload;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/map_save", web::post().to(upload::upload_images))
    );
}