use crate::{
    models::map::{Map, MapSaveReq},
    statics::err_msg::{DB_FIND_FAIL, DB_FIND_MAP_FAIL, DB_INCORRECT_TOKEN_ID},
};
use mongodb::{
    bson::{self, doc, oid::ObjectId},
    Client, Database,
};

use futures_util::TryStreamExt;

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

pub async fn map_me (
    user_id: &str,
    db: &Database,
) -> Result<Vec<Map>, Box<dyn std::error::Error>> {
    let maps = db.collection::<Map>("maps");

    let object_id_user = ObjectId::parse_str(user_id)?;
    let find_doc = doc! {"user_id": object_id_user};

    let mut cursor = maps.find(find_doc, None).await?;

    let mut find_maps: Vec<Map> = Vec::new();
    while let Some(map) = cursor.try_next().await? {
        find_maps.push(map);
    }

    Ok(find_maps)
}