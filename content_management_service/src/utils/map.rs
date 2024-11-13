use std::{collections::HashSet, env};

use crate::models::{app_err::AppError, map::Map};

use aws_sdk_s3::Client;
use mongodb::bson;
use mongodb::bson::Document;

use super::s3::{copy_s3, remove_s3};

// 맵의 변경점을 찾아내는 로직
pub async fn detect_map_changes(
    s3_client: &Client,
    original: &Map,
    updated: &mut Map,
) -> Result<Document, AppError> {
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

        // HashSet을 사용하여 중복 없이 URL 수집
        let mut updated_urls = HashSet::new();

        let check_url = format!(
            "https://{}.s3.amazonaws.com/{}/",
            bucket_temp_name, bucket_temp_dir
        );

        for url in updated
            .marks
            .iter_mut()
            .flat_map(|mark| mark.urls.iter_mut())
        {
            // 추가된 URL이 임시 저장소에 있는 경우 최종 버킷으로 이동
            if url.contains(&check_url) {
                let dst_url = copy_s3(s3_client, &url).await?;

                // 최종 URL로 변경하여 updated.marks에 반영한다
                *url = dst_url
            }
            updated_urls.insert(url.clone());
        }

        // 삭제된 URLs
        let deleted_urls: HashSet<_> = original_urls.difference(&updated_urls).collect();
        for url in &deleted_urls {
            remove_s3(s3_client, url).await?;
        }

        update_doc.insert("marks", bson::to_bson(&updated.marks)?);
    }

    Ok(update_doc)
}

// 새로운 맵을저장할 때, url 경로를 변환하여 S3에 저장 하는 로직
pub async fn new_map_changes_url(s3_client: &Client, map: &mut Map) -> Result<(), AppError> {
    for url in map.marks.iter_mut().flat_map(|mark| mark.urls.iter_mut()) {
        let dst_url = copy_s3(s3_client, &url).await?;

        *url = dst_url;
    }
    Ok(())
}
