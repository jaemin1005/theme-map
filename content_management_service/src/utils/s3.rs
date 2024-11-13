use std::env;

use aws_sdk_s3::Client;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};
use uuid::Uuid;

use crate::models::app_err::AppError;

// s3에서의 파일 복사
// src -> dst의 경로로 파일을 복사한다
pub async fn copy_s3(s3_client: &Client, url: &str) -> Result<String, AppError> {
    //! 기존의 temp 파일의 삭제는 S3 규칙에 의해 하루마다 삭제되게 한다
    let bucket_temp_name = env::var("S3_BUCKET_TEMP_NAME")?;
    let bucket_target_name = env::var("S3_BUCKET_TARGET_NAME")?;
    let bucket_target_dir = env::var("S3_TARGET_DIR")?;

    let file_name = url.split('/').last().ok_or(AppError::FileNameNotFound)?;
    let file_id = Uuid::new_v4().to_string();

    let src_s3_key = url.replace(
        &format!("https://{}.s3.amazonaws.com/", bucket_temp_name),
        "",
    );

    let dst_s3_key = format!("{}/{}/{}", bucket_target_dir, file_id, file_name);

    let encoded_src_key = utf8_percent_encode(&src_s3_key, NON_ALPHANUMERIC).to_string();
    let copy_source = format!("{}/{}", bucket_temp_name, encoded_src_key);

    s3_client
        .copy_object()
        .copy_source(copy_source)
        .bucket(bucket_target_name.clone())
        .key(dst_s3_key.clone())
        .send()
        .await?;

    Ok(format!(
        "https://{}.s3.amazonaws.com/{}",
        bucket_target_name, dst_s3_key
    ))
}

// s3에서의 파일 삭제
pub async fn remove_s3(s3_client: &Client, url: &str) -> Result<(), AppError> {
    let bucket_target_name = env::var("S3_BUCKET_TARGET_NAME")?;

    let parsing_file_key = url.replace(
        &format!("https://{}.s3.amazonaws.com/", bucket_target_name),
        "",
    );

    let key = format!("{}", parsing_file_key);
    //let encoded_key = utf8_percent_encode(&key, NON_ALPHANUMERIC).to_string();
    s3_client
        .delete_object()
        .bucket(bucket_target_name)
        .key(key)
        .send()
        .await?;
    Ok(())
}
