use actix_web::{web, HttpRequest, HttpResponse, Responder};
use mongodb::Database;
use percent_encoding::percent_decode_str;

use crate::models::err::ErrorRes;
use crate::models::search_model::SearchQuery;
use crate::services::search_service;
use crate::utils::get_user_info::get_user_info;

pub async fn search(
    req: HttpRequest,
    query: web::Query<SearchQuery>,
    db: web::Data<Database>,
) -> impl Responder {
    let user_id = get_user_info(&req).ok();

    let search_type = &query.search_type;
    let body = percent_decode_str(&query.body).decode_utf8_lossy();


    match search_service::search_map(search_type, &body, user_id.as_deref(), &db).await {
        Ok(map) => HttpResponse::Ok().json(map),
        Err(e) => HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    }
}
