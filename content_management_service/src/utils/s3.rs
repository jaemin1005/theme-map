use aws_sdk_s3::Client;

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

    let copy_key = format!("{}/{}", src_bucket_name, src_key);

    s3_client
        .copy_object()
        .copy_source(copy_key)
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
