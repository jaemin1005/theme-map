use aws_sdk_s3::Client;
use percent_encoding::{utf8_percent_encode, NON_ALPHANUMERIC};

// s3에서의 파일 복사
// src -> dst의 경로로 파일을 복사한다
pub async fn copy_s3(
    s3_client: &Client,
    src_bucket_name: &str,
    dst_bucket_name: &str,
    src_key: &str,
    dst_key: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    //! 기존의 temp 파일의 삭제는 S3 규칙에 의해 하루마다 삭제되게 한다

    let encoded_src_key = utf8_percent_encode(src_key, NON_ALPHANUMERIC).to_string();
    let copy_source = format!("{}/{}", src_bucket_name, encoded_src_key);

    s3_client
        .copy_object()
        .copy_source(copy_source)
        .bucket(dst_bucket_name)
        .key(dst_key)
        .send()
        .await?;
    Ok(())
}

// s3에서의 파일 삭제
pub async fn remove_s3(
    s3_client: &Client,
    buck_name: &str,
    key: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    s3_client
        .delete_object()
        .bucket(buck_name)
        .key(key)
        .send()
        .await?;
    Ok(())
}
