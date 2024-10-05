use actix_web::{web, HttpRequest, HttpResponse, Responder};
use mongodb::Database;

use crate::models::user::{ErrorResponse, LoginRequest, RegisterRequest};
use crate::services::auth_service;
use crate::utils::user::user_to_user_res;

pub async fn register(
    req_body: web::Json<RegisterRequest>,
    db: web::Data<Database>,
) -> impl Responder {
    match auth_service::register_user(req_body.into_inner(), &db).await {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => HttpResponse::InternalServerError().json(ErrorResponse::new(e.to_string())),
    }
}

pub async fn login(
    req_body: web::Json<LoginRequest>,
    db: web::Data<Database>,
) -> impl Responder {
    match auth_service::login_user(req_body.into_inner(), &db).await {
        Ok(response) => HttpResponse::Ok().json(response),
        Err(e) => HttpResponse::Unauthorized().json(ErrorResponse::new(e.to_string())),
    }
}

pub async fn refresh(
    req: HttpRequest,
    db: web::Data<Database>,
) -> impl Responder {
    match auth_service::refresh_token(&req, &db).await {
        Ok(response) => HttpResponse::Ok().json(response),
        Err(e) => HttpResponse::Unauthorized().json(ErrorResponse::new(e.to_string())),
    }
}

pub async fn logout(
    req: HttpRequest,
    db: web::Data<Database>,
) -> impl Responder {
    match auth_service::logout_user(&req, &db).await {
        Ok(_) => HttpResponse::Ok().body("로그아웃되었습니다."),
        Err(e) => HttpResponse::InternalServerError().json(ErrorResponse::new(e.to_string())),
    }
}

pub async fn me(
    req: HttpRequest,
    db: web::Data<Database>,
) -> impl Responder {
    match auth_service::get_user_info(&req, &db).await {
        Ok(user) => HttpResponse::Ok().json(user_to_user_res(user)),
        Err(e) => HttpResponse::Unauthorized().json(ErrorResponse::new(e.to_string())),
    }
}

pub async fn refresh_aceess_token (req: HttpRequest, db:web::Data<Database>) -> impl Responder {
    match auth_service::refresh_aceess_token(&req, &db).await {
        Ok(res) => HttpResponse::Ok().json(res),
        Err(e) => HttpResponse::Unauthorized().json(ErrorResponse::new(e.to_string())),    
    }
}