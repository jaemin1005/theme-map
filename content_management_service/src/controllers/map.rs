use actix_web::{web, HttpRequest, HttpResponse};
use aws_sdk_s3::Client;
use mongodb::Database;

use crate::models::app_err::AppError;
use crate::models::map::{MapDetails, MapId};
use crate::models::path::MapIdpath;
use crate::services::map_service;
use crate::utils::get_user_info::get_user_info;

pub async fn map_save(
    req: HttpRequest,
    body: web::Json<MapDetails>,
    db: web::Data<Database>,
    s3_client: web::Data<Client>,
) -> Result<HttpResponse, AppError> {
    let user_id = get_user_info(&req)?;

    let map = map_service::map_save(body.into_inner(), &user_id, &db, &s3_client).await?;
    Ok(HttpResponse::Ok().json(MapDetails::new_with_map(map)))
}

pub async fn map_edit(
    req: HttpRequest,
    body: web::Json<MapDetails>,
    db: web::Data<Database>,
    s3_client: web::Data<Client>,
) -> Result<HttpResponse, AppError> {
    let user_id = get_user_info(&req)?;

    let map = map_service::map_edit(body.into_inner(), &user_id, &db, &s3_client).await?;
    Ok(HttpResponse::Ok().json(MapDetails::new_with_map(map)))
}

pub async fn map_me(req: HttpRequest, db: web::Data<Database>) -> Result<HttpResponse, AppError> {
    let user_id = get_user_info(&req)?;

    let maps = map_service::map_me(&user_id, &db).await?;
    Ok(HttpResponse::Ok().json(maps))
}

pub async fn map_read(
    req: HttpRequest,
    body: web::Json<MapId>,
    db: web::Data<Database>,
) -> Result<HttpResponse, AppError> {
    let user_id = get_user_info(&req).ok();
    let MapId { id } = body.into_inner();

    let map_read_res = map_service::map_read(&id, user_id.as_deref(), &db).await?;
    Ok(HttpResponse::Ok().json(map_read_res))
}

pub async fn map_remove(
    req: HttpRequest,
    body: web::Json<MapId>,
    db: web::Data<Database>,
    s3_client: web::Data<Client>,
) -> Result<HttpResponse, AppError> {
    let user_id = get_user_info(&req)?;

    let MapId { id } = body.into_inner();

    let map_id = map_service::map_remove(&id, &user_id, &db, &s3_client).await?;
    Ok(HttpResponse::Ok().json(map_id))
}

pub async fn map_like(
    req: HttpRequest,
    path: web::Path<MapIdpath>,
    db: web::Data<Database>,
) -> Result<HttpResponse, AppError> {
    let user_id = get_user_info(&req)?;

    let likes = map_service::map_like(&path.map_id, &user_id, &db).await?;
    Ok(HttpResponse::Ok().json(likes))
}

pub async fn map_dislike(
    req: HttpRequest,
    path: web::Path<MapIdpath>,
    db: web::Data<Database>,
) -> Result<HttpResponse, AppError> {
    let user_id = get_user_info(&req)?;

    let likes = map_service::map_dislike(&path.map_id, &user_id, &db).await?;
    Ok(HttpResponse::Ok().json(likes))
}
