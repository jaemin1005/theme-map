use std::env;

use actix_web::{web, HttpRequest, HttpResponse, Responder};
use actix_multipart::Multipart;
use aws_sdk_s3::Client;

use crate::{models::{err::ErrorRes, upload_model::UploadImgRes}, services::upload_service};

/**
 * 이미지 업로드
 * req: 나중에 엑세스 토큰 유효성 검사를 위해 대기...
 * ! 유효성 검사를 넣는다고 하면 비회원 유저들은 마크를 사용할 수가 없다.
 */
pub async fn upload_images(req: HttpRequest, payload: Multipart, client: web::Data<Client> ) -> impl Responder {

  // buck
  let bucket_name = match env::var("AWS_S3_BUCKET_NAME") {
    Ok(name) => name,
    Err(e) => return HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string()))
  };

  match upload_service::upload_images(&client, &bucket_name, payload).await {
    Ok(res) => HttpResponse::Ok().json(UploadImgRes{ img_urls: res }),
    Err(e) => HttpResponse::InternalServerError().json(ErrorRes::new(&e.to_string())) 
  }
}
