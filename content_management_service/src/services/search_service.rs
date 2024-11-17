use mongodb::{
    bson::{doc, oid::ObjectId},
    options::FindOptions,
    Database,
};

use crate::models::{
    app_err::AppError,
    map::{Map, MapSearchResult},
    search_model::SearchType,
    user::User,
};

use futures_util::TryStreamExt;
use std::time::Duration;

pub async fn search_map(
    search_type: &SearchType,
    body: &str,
    user_id: Option<&str>,
    db: &Database,
) -> Result<Vec<MapSearchResult>, AppError> {
    let maps = db.collection::<Map>("maps");
    let users = db.collection::<User>("users");

    // Optional user_id를 ObjectId로 변환
    let object_id_user = if let Some(user_id) = user_id {
        Some(ObjectId::parse_str(user_id)?)
    } else {
        None
    };

    // 검색 조건 설정
    let find_doc = match search_type {
        SearchType::TITLE => {
            doc! {"title": { "$regex": body, "$options": "i" }}
        }
        SearchType::USER => {
            let user = users
                .find_one(doc! {"name": { "$regex": body, "$options": "i" }}, None)
                .await?
                .ok_or(AppError::UserNotFound)?;
            doc! {"user_id": user.id}
        }
    };

    let options = FindOptions::builder()
        .max_time(Duration::from_secs(10))
        .build();
    // Map 문서 검색
    let mut cursor = maps.find(find_doc, options).await?;

    let mut find_maps: Vec<Map> = Vec::new();
    while let Some(map) = cursor.try_next().await? {
        find_maps.push(map);
    }

    // 검색된 Map을 MapSearchRes로 변환하여 반환
    let res: Vec<MapSearchResult> = find_maps
        .into_iter()
        .map(|map| {
            let id = map.id.ok_or(AppError::ObjectIdNotFound)?;
            let is_edit = object_id_user.map_or(false, |obj_id| obj_id == map.user_id);
            Ok(MapSearchResult {
                id,
                title: map.title.clone(),
                body: map.body.clone(),
                is_edit,
                likes: map.likes.clone(),
            })
        })
        .collect::<Result<_, AppError>>()?;

    Ok(res)
}
