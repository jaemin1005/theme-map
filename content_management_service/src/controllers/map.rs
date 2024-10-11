use actix_web::{web, HttpRequest, HttpResponse, Responder};
use mongodb::{Client, Database};

use crate::models::err::ErrorRes;
use crate::models::map::{MapReadReq, MapSaveReq};
use crate::models::upload_model::UploadImgRes;
use crate::services::map_service;
use crate::statics::err_msg;
use crate::utils::get_user_info::get_user_info;

pub async fn map_save(
    req: HttpRequest,
    body: web::Json<MapSaveReq>,
    db: web::Data<Database>,
    client: web::Data<Client>,
) -> impl Responder {
    let user_id = match get_user_info(&req) {
        Ok(user_id) => user_id,
        Err(e) => return HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    };

    // let email = match user_service::get_user_email_by_id(&user_id, &db).await  {
    //     Ok(email) => email,
    //     Err(e) => return HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string()))
    // };

    match map_service::map_save(body.into_inner(), &user_id, &db, &client).await {
        Ok(map) => match map.id {
            Some(id) => HttpResponse::Ok().json(id),
            None => HttpResponse::InternalServerError().json(ErrorRes::new(err_msg::DB_ERR_MSG)),
        },
        Err(e) => HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    }
}

pub async fn map_me(req: HttpRequest, db: web::Data<Database>) -> impl Responder {
    let user_id = match get_user_info(&req) {
        Ok(user_id) => user_id,
        Err(e) => return HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    };

    match map_service::map_me(&user_id, &db).await {
        Ok(maps) => HttpResponse::Ok().json(maps),
        Err(e) => HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    }
}

pub async fn map_read(
    req: HttpRequest,
    body: web::Json<MapReadReq>,
    db: web::Data<Database>,
) -> impl Responder {
    let user_id = match get_user_info(&req) {
        Ok(user_id) => user_id,
        Err(e) => return HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    };

    let MapReadReq { id } = body.into_inner();

    match map_service::map_read(&id, &user_id, &db).await {
        Ok(res) => HttpResponse::Ok().json(res),
        Err(e) => HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    }
}

pub async fn map_remove(
    req: HttpRequest,
    body: web::Json<MapReadReq>,
    db: web::Data<Database>,
) -> impl Responder {
    let user_id = match get_user_info(&req) {
        Ok(user_id) => user_id,
        Err(e) => return HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    };

    let MapReadReq { id } = body.into_inner();

    match map_service::map_remove(&id, &user_id, &db).await {
        Ok(res) => HttpResponse::Ok().json(UploadImgRes { img_urls: res }),
        Err(e) => HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())),
    }
}
