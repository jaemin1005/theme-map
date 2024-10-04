use actix_web::{web, HttpResponse, Responder};


use crate::{controllers::map, models::map::MapSaveReq};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/map_save", web::post().to(map::map_save))
    );
}