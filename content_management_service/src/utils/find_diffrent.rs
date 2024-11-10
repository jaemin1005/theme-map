use std::{collections::HashSet, env};

use crate::{models::map::Map, statics::err_msg::NOT_FILE_NAME_FOUND};

use aws_sdk_s3::Client;
use mongodb::bson;
use mongodb::bson::Document;
use uuid::Uuid;

use super::s3::{copy_s3, remove_s3};

// 맵의 변경점을 찾아내는 로직
pub async fn detect_map_changes(
    s3_client: &Client,
    original: &Map,
    updated: &mut Map,
) -> Result<Document, Box<dyn std::error::Error>> {
    let mut update_doc = Document::new();

    if original.title != updated.title {
        update_doc.insert("title", &updated.title);
    }
    if original.body != updated.body {
        update_doc.insert("body", &updated.body);
    }

    // 마크 전체 비교
    if original.marks != updated.marks {
        // 마커가 달라진 경우 전체 업데이트
        let original_urls: HashSet<String> = original
            .marks
            .iter()
            .flat_map(|mark| mark.urls.iter().cloned())
            .collect();

        let bucket_temp_name = env::var("S3_BUCKET_TEMP_NAME")?;
        let bucket_temp_dir = env::var("S3_TEMP_DIR")?;
        let bucket_target_name = env::var("S3_BUCKET_TARGET_NAME")?;
        let bucket_target_dir = env::var("S3_TARGET_DIR")?;

        // HashSet을 사용하여 중복 없이 URL 수집
        let mut updated_urls = HashSet::new();

        let check_url = format!(
            "https://{}.s3.amazonaws.com/{}/",
            bucket_temp_name, bucket_temp_dir
        );

        for mark in updated.marks.iter_mut() {
            for url in &mut mark.urls {
                // 추가된 URL이 임시 저장소에 있는 경우 최종 버킷으로 이동
                if url.contains(&check_url) {
                    let file_name = url.split('/').last().ok_or(NOT_FILE_NAME_FOUND)?;
                    let file_id = Uuid::new_v4().to_string();

                    let src_s3_key = url.replace(
                        &format!("https://{}.s3.amazonaws.com/", bucket_temp_name),
                        "",
                    );
                    let dst_s3_key = format!("{}/{}/{}", bucket_target_dir, file_id, file_name);

                    copy_s3(
                        s3_client,
                        &bucket_temp_name,
                        &bucket_target_name,
                        &src_s3_key,
                        &dst_s3_key,
                    )
                    .await?;

                    // 최종 URL로 변경하여 updated.marks에 반영한다
                    *url = format!(
                        "https://{}.s3.amazonaws.com/{}",
                        bucket_target_name, dst_s3_key
                    );
                }
                updated_urls.insert(url.clone());
            }
        }

        // 삭제된 URLs
        let deleted_urls: HashSet<_> = original_urls.difference(&updated_urls).collect();
        for url in &deleted_urls {
            let bucket_target_name = env::var("S3_BUCKET_TARGET_NAME")?;
            let key = url.replace(
                &format!("https://{}.s3.amazonaws.com/", bucket_target_name),
                "",
            );

            remove_s3(s3_client, &bucket_target_name, &key).await?;
        }

        update_doc.insert("marks", bson::to_bson(&updated.marks)?);
    }

    Ok(update_doc)
}
