use aws_sdk_s3::{primitives::ByteStream, Client};
use actix_multipart::Multipart;
use actix_web::web;
use futures_util::TryStreamExt;
use uuid::Uuid;

use crate::statics::err_msg::{FILE_NO_FILENAME, FILE_NO_METADATA};

pub async fn upload_images(
    s3_client: &Client,
    bucket_name: &str,
    mut payload: Multipart,
) -> Result<Vec<String>, Box<dyn std::error::Error>> {
    let mut image_urls = Vec::new();

    while let Ok(Some(mut field)) = payload.try_next().await {
        // 파일의 메타 정보를 가져온다. 없을 경우 에러
        let content_disposition = field.content_disposition().ok_or(FILE_NO_METADATA)?;
        // 파일 이름을 가져온다. 파일의 이름이 없을 경우 default: file
        let filename = content_disposition.get_filename().ok_or(FILE_NO_FILENAME)?;

        let file_id = Uuid::new_v4().to_string();
        
        let s3_key = format!("uploads/{}/{}", file_id, filename);

        let mut bytes = web::BytesMut::new();
        while let Ok(Some(chunk)) = field.try_next().await {
            let data = chunk;
            bytes.extend_from_slice(&data);
        }

        // S3에서 파일을 ByteStream으로 받기 떄문에 변환
        let byte_stream = ByteStream::from(bytes.to_vec());

        // S3에 파일 업로드
        s3_client
            .put_object()
            .bucket(bucket_name)
            .key(&s3_key)
            .content_type("image/webp")
            .body(byte_stream)
            .send()
            .await?;

        // 이미지 URL 생성 및 벡터에 추가
        let image_url = format!("https://{}.s3.amazonaws.com/{}", bucket_name, s3_key);
        image_urls.push(image_url);
    }

    Ok(image_urls)
}
