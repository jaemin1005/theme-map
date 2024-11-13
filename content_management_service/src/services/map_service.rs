use crate::{
    models::{
        app_err::AppError,
        map::{Map, MapDetails, MapId, MapReadRes, MapSearchResult},
    },
    utils::{
        map::{detect_map_changes, new_map_changes_url},
        s3::remove_s3,
    },
};

use aws_sdk_s3::Client as S3Client;
use mongodb::{
    bson::{doc, oid::ObjectId},
    options::UpdateOptions,
    Database,
};

use futures_util::TryStreamExt;

/**
 * 맵을 저장하는 로직
 * _id가 없을 경우, 새로운 맵을 저장
 * _id가 있을 경우, 잘못된 접근임으로 에러
 */
pub async fn map_save(
    map_details: MapDetails,
    user_id: &str,
    db: &Database,
    s3_client: &S3Client,
) -> Result<Map, AppError> {
    let maps = db.collection::<Map>("maps");

    let object_id = ObjectId::parse_str(user_id)?;

    // _id가 없을 경우, 새로운 맵이라고 판단한다.
    if let None = map_details.id {
        let mut map = Map::new_with_details(object_id, map_details);

        new_map_changes_url(s3_client, &mut map).await?;

        let insert_result = maps.insert_one(map, None).await?;

        let result_id = insert_result
            .inserted_id
            .as_object_id()
            .ok_or(AppError::ObjectIdNotFound)?;

        let new_map = maps
            .find_one(doc! {"_id": result_id.clone()}, None)
            .await?
            .ok_or(AppError::MapNotFound)?;

        Ok(new_map)
    } else {
        Err(AppError::InvalidAceessError)
    }
}

/**
 * #1 ID를 통해 2개의 맵을 비교한다.
 * #2 달라진것들은 Vec를 통해 변경한다.
 * #3 이미지의 Url인 경우에는 S3 존재하는지 확인하고, 없을시 update
 * ++ 임시 이미지인가도 확인이 필요하다.
 */
pub async fn map_edit(
    map_details: MapDetails,
    user_id: &str,
    db: &Database,
    client: &S3Client,
) -> Result<Map, AppError> {
    if let None = map_details.id {
        Err(AppError::InvalidAceessError)
    } else {
        let maps = db.collection::<Map>("maps");

        // 원래 저장되어있는 맵
        let find_map = maps
            .find_one(doc! {"_id" : map_details.id}, None)
            .await?
            .ok_or(AppError::MapNotFound)?;

        let object_user_id = ObjectId::parse_str(user_id)?;

        // 수정하려는 맵이 옳바른 유저의 접근인지 판단
        if find_map.user_id != object_user_id {
            return Err(AppError::InvalidAceessError);
        }

        let mut update_map = Map::new_with_details(object_user_id, map_details);

        // Diffrent 로직

        let update_doc = detect_map_changes(client, &find_map, &mut update_map).await?;

        if update_doc.is_empty() == false {
            // 맵 업데이트

            let filter = doc! { "_id": update_map.id };
            let update = doc! { "$set":  update_doc};

            // 업데이트 옵션 설정, 문서가 없을 경우 생성하는걸 방지한다
            let options = UpdateOptions::builder().upsert(false).build();

            maps.update_one(filter, update, options).await?;
        }

        // DB의 업데이트 된 맵을 찾아 체크 후 반환
        let check_map = maps
            .find_one(doc! {"_id": update_map.id}, None)
            .await?
            .ok_or(AppError::MapNotFound)?;

        Ok(check_map)
    }
}

/**
 * 자기가 저장한 맵을 불러온다.
 * user_id를 통해, 자기의 맵을 불러옴
 */
pub async fn map_me(user_id: &str, db: &Database) -> Result<Vec<MapSearchResult>, AppError> {
    let maps = db.collection::<Map>("maps");

    let object_id_user = ObjectId::parse_str(user_id)?;
    let find_doc = doc! {"user_id": object_id_user};

    let mut cursor = maps.find(find_doc, None).await?;

    let mut find_maps: Vec<Map> = Vec::new();
    while let Some(map) = cursor.try_next().await? {
        find_maps.push(map);
    }

    // ObjectId가 None일때 에러를 반환.
    let res: Vec<MapSearchResult> = find_maps
        .iter()
        .map(|map| {
            let id = map.id.clone().ok_or(AppError::ObjectIdNotFound)?;
            Ok(MapSearchResult {
                id,
                title: map.title.clone(),
                body: map.body.clone(),
                is_edit: object_id_user == map.user_id,
            })
        })
        .collect::<Result<_, AppError>>()?;

    Ok(res)
}

/**
 * _id를 통해 맵을 가져오는 로직
 * MongoDB의 저장된 user_id 와 access_token의 user_id를 비교하여 수정가능한지 판단한다.
 */
pub async fn map_read(
    _id: &ObjectId,
    user_id: Option<&str>,
    db: &Database,
) -> Result<MapReadRes, AppError> {
    let maps = db.collection::<Map>("maps");
    let find_doc = doc! {"_id": _id};

    let object_id_user = if let Some(user_id) = user_id {
        Some(ObjectId::parse_str(user_id)?)
    } else {
        None
    };

    let find_map = maps
        .find_one(find_doc, None)
        .await?
        .ok_or(AppError::MapNotFound)?;
    let is_edit = object_id_user.map_or(false, |obj_id| obj_id == find_map.user_id);

    let map_save_req = MapDetails {
        id: find_map.id,
        title: find_map.title,
        body: find_map.body,
        marks: find_map.marks,
    };

    Ok(MapReadRes {
        map: map_save_req,
        is_edit,
    })
}

/**
 * _id를 통해 맵을 삭제하는 로직
 * MongoDB의 저장된 user_id 와 access_token의 user_id를 비교하여 삭제 가능한지 판단
 */
pub async fn map_remove(
    _id: &ObjectId,
    user_id: &str,
    db: &Database,
    s3_client: &S3Client,
) -> Result<MapId, AppError> {
    let maps = db.collection::<Map>("maps");
    let find_doc = doc! {"_id": _id};

    let find_map = maps
        .find_one(find_doc.clone(), None)
        .await?
        .ok_or(AppError::MapNotFound)?;

    let map_object_id = find_map.id.ok_or(AppError::ObjectIdNotFound)?;

    if find_map.user_id != ObjectId::parse_str(user_id)? {
        return Err(AppError::InvalidAceessError);
    }

    let urls = find_map
        .marks
        .iter()
        .flat_map(|mark| mark.urls.clone())
        .collect::<Vec<_>>();

    // 이미지 삭제
    for url in urls {
        remove_s3(s3_client, &url).await?;
    }

    // 맵 삭제
    maps.delete_one(find_doc, None).await?;

    return Ok(MapId::new(map_object_id));
}
