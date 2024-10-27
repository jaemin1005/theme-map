use actix_web::{HttpResponse, Responder};

pub async fn home() -> impl Responder {
    HttpResponse::Ok().body("Hello, Auth_Service_Actix_web")
}
