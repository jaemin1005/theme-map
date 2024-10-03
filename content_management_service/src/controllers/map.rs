use actix_web::{web, HttpRequest, HttpResponse, Responder};
use mongodb::{Client, Database};

use crate::models::err::ErrorRes;
use crate::models::map::{MapSaveReq, MapSaveRes};
use crate::statics::err_msg;
use crate::utils::get_user_info::get_user_info;
use crate::services::map_service;

pub async fn map_save(
  req: HttpRequest,
  body: web::Json<MapSaveReq>,
  db: web::Data<Database>,
  client: web::Data<Client>
) -> impl Responder {
    let user_id = match get_user_info(&req){
      Ok(user_id) => user_id,
      Err(e) => return HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    };

    match map_service::map_save(body.into_inner(), &user_id, &db, &client).await{
      Ok(map) => match map.id {
          Some(id) => HttpResponse::Ok().json(MapSaveRes::new(id)),
          None => HttpResponse::InternalServerError().json(ErrorRes::new(err_msg::DB_ERR_MSG)),
      }
      Err(e) => HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string()))
    }
}