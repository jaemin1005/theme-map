use actix_web::{web, HttpRequest, HttpResponse};
use mongodb::Database;

use crate::models::app_err::AppError;
use crate::models::user::{LoginRequest, RegisterRequest};
use crate::services::auth_service;
use crate::utils::user::get_user_device_id;

pub async fn register(
    req_body: web::Json<RegisterRequest>,
    db: web::Data<Database>,
) -> Result<HttpResponse, AppError> {
    let user = auth_service::register_user(req_body.into_inner(), &db).await?;
    Ok(HttpResponse::Ok().json(user))
}

pub async fn login(
    req: HttpRequest,
    req_body: web::Json<LoginRequest>,
    db: web::Data<Database>,
) -> Result<HttpResponse, AppError> {
    let device_id = get_user_device_id(&req)?;

    let res = auth_service::login_user(req_body.into_inner(), &device_id, &db).await?;
    Ok(HttpResponse::Ok().json(res))
}

pub async fn refresh(req: HttpRequest, db: web::Data<Database>) -> Result<HttpResponse, AppError> {
    let device_id = get_user_device_id(&req)?;
    let res = auth_service::refresh_token(&req, &device_id, &db).await?;
    Ok(HttpResponse::Ok().json(res))
}

pub async fn logout(req: HttpRequest, db: web::Data<Database>) -> Result<HttpResponse, AppError> {
    auth_service::logout_user(&req, &db).await?;
    Ok(HttpResponse::Ok().body("로그아웃되었습니다."))
}

pub async fn me(req: HttpRequest, db: web::Data<Database>) -> Result<HttpResponse, AppError> {
    let user = auth_service::get_user_info(&req, &db).await?;
    Ok(HttpResponse::Ok().json(user))
}

pub async fn refresh_aceess_token(
    req: HttpRequest,
    db: web::Data<Database>,
) -> Result<HttpResponse, AppError> {
    let device_id = get_user_device_id(&req)?;
    let res = auth_service::refresh_aceess_token(&req, &device_id, &db).await?;
    Ok(HttpResponse::Ok().json(res))
}
