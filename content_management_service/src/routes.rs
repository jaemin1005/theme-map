use actix_web::{web, HttpResponse};

use crate::controllers::{map, search};

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("")
            .route("/map_save", web::post().to(map::map_save))
            .route("/map_edit", web::post().to(map::map_edit))
            .route("/map_me", web::get().to(map::map_me))
            .route("/map_read", web::post().to(map::map_read))
            .route("/map_remove", web::post().to(map::map_remove))
            .route("/search", web::get().to(search::search))
            .route("/maps/{map_id}/like", web::post().to(map::map_like)) // 병합된 경로
            .route("/maps/{map_id}/like", web::delete().to(map::map_dislike)), // 병합된 경로
    )
    .default_service(web::route().to(|req: actix_web::HttpRequest| async move {
        println!("Unmatched route: {}", req.uri());
        HttpResponse::NotFound().body(format!("Route not found: {}", req.uri()))
    }));
}
