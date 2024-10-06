use crate::{
    models::map::{Map, MapReadRes, MapSaveReq, MapSearchRes},
    statics::err_msg::{DB_FIND_FAIL, DB_FIND_MAP_FAIL, DB_INCORRECT_TOKEN_ID},
};
use mongodb::{
    bson::{self, doc, oid::ObjectId},
    Client, Database,
};

use futures_util::TryStreamExt;

/**
 * 맵을 저장하는 로직
 * _id가 없을 경우, 새로운 맵을 저장
 * _id가 있을 경우, 맵을 일괄 삭제 및 추가하는 과정을 거친다 (트랜잭션으로 일관성 보장)
 * ! 부분 업데이트, 부분 삭제를 할 수 있는지? 비용에 대한 계산이 필요,
 */
pub async fn map_save(
    map_save_req: MapSaveReq,
    user_id: &str,
    db: &Database,
    client: &Client,
) -> Result<Map, Box<dyn std::error::Error>> {
    let maps = db.collection::<Map>("maps");

    let object_id = ObjectId::parse_str(user_id)?;

    // _id가 없을 경우, 새로운 맵이라고 판단한다.
    if let None = map_save_req.id {
        let map = Map::new_with_req(object_id, map_save_req);

        let insert_result = maps.insert_one(map, None).await?;

        let result_id = insert_result
            .inserted_id
            .as_object_id()
            .ok_or("삽입된 ID를 가져오지 못했습니다.")?;

        let new_map = maps
            .find_one(doc! {"_id": result_id.clone()}, None)
            .await?
            .ok_or(DB_FIND_MAP_FAIL)?;

        Ok(new_map)
    } else {

        let find_doc = doc! {"_id": map_save_req.id};

        let find_map = maps
            .find_one(find_doc.clone(), None)
            .await?
            .ok_or(DB_FIND_FAIL)?;

        if find_map.user_id != object_id {
            return Err(DB_INCORRECT_TOKEN_ID.into())
        }

        // session 생성
        let mut session = client.start_session(None).await?;

        // `db`에서 MongoDB 클라이언트를 가져옴
        // 맵이 존재했을 때, 저장 ( 일괄 삭제 및 추가 ), 트랜잭션으로 일관성을 보장한다
        // 트랜잭션 시작
        session.start_transaction(None).await?;

        let unset = doc! {
          "$unset" : { "title": "", "body": "", "marks": "" }
        };

        maps.update_one_with_session(find_doc.clone(), unset, None, &mut session)
            .await?;

        let marks_bson_value = bson::to_bson(&map_save_req.marks)?;

        let set = doc! {
          "$set": {"title": map_save_req.title, "body": map_save_req.body, "marks": marks_bson_value}
        };

        maps.update_one_with_session(find_doc.clone(), set, None, &mut session)
            .await?;

        let update_map = maps
            .find_one_with_session(find_doc.clone(), None, &mut session)
            .await?
            .ok_or(DB_FIND_FAIL)?;

        session.commit_transaction().await?;

        Ok(update_map)
    }
}

/**
 * 자기가 저장한 맵을 불러온다.
 * user_id를 통해, 자기의 맵을 불러옴
 */
pub async fn map_me (
    user_id: &str,
    db: &Database,
) -> Result<Vec<MapSearchRes>, Box<dyn std::error::Error>> {
    let maps = db.collection::<Map>("maps");

    let object_id_user = ObjectId::parse_str(user_id)?;
    let find_doc = doc! {"user_id": object_id_user};

    let mut cursor = maps.find(find_doc, None).await?;

    let mut find_maps: Vec<Map> = Vec::new();
    while let Some(map) = cursor.try_next().await? {
        find_maps.push(map);
    }

    // ObjectId가 None일때 에러를 반환.
    let res: Vec<MapSearchRes> = find_maps.iter().map(|map| {
        let id = map.id.clone().ok_or("Map ID is missing")?; 
        Ok(MapSearchRes {
            id,
            title: map.title.clone(),
            body: map.body.clone(),
        })
    }).collect::<Result<_, Box<dyn std::error::Error>>>()?; 

    Ok(res)
}

pub async fn map_read (_id: &ObjectId, user_id: &str, db: &Database) -> Result<MapReadRes, Box<dyn std::error::Error>> {

    let maps = db.collection::<Map>("maps");
    let find_doc = doc! {"_id": _id};

    let object_id_user = ObjectId::parse_str(user_id)?;

    let find_map = maps.find_one(find_doc, None).await?.ok_or(DB_FIND_FAIL)?;

    let map_save_req = MapSaveReq {
        id: find_map.id,
        title: find_map.title,
        body: find_map.body,
        marks: find_map.marks
    };

    Ok(
        MapReadRes {
            map: map_save_req,
            is_edit: find_map.user_id == object_id_user,
        }
    )
}