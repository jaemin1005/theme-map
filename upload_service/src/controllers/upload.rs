use std::env;

use actix_multipart::Multipart;
use actix_web::{web, HttpRequest, HttpResponse};
use aws_sdk_s3::Client;

use crate::{
    models::{app_err::AppError, upload_model::UploadImgRes},
    services::upload_service,
};

/**
 * 이미지 업로드
 * req: 나중에 엑세스 토큰 유효성 검사를 위해 대기...
 * ! 유효성 검사를 넣는다고 하면 비회원 유저들은 마크를 사용할 수가 없다.
 */
pub async fn upload_images(
    _req: HttpRequest,
    payload: Multipart,
    client: web::Data<Client>,
) -> Result<HttpResponse, AppError> {
    // buck
    let bucket_name = env::var("AWS_S3_BUCKET_NAME")?;

    let images = upload_service::upload_images(&client, &bucket_name, payload).await?;
    Ok(HttpResponse::Ok().json(UploadImgRes { img_urls: images }))
}
