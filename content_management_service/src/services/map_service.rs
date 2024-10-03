use crate::models::map::MapSaveReq;
use mongodb::{
    bson::{self, doc}, Client, Database
};

pub async fn map_save(
    map: MapSaveReq,
    user_id: &str,
    db: &Database,
    client: &Client,
) -> Result<MapSaveReq, Box<dyn std::error::Error>> {
    let maps = db.collection::<MapSaveReq>("maps");

    // _id가 없을 경우, 새로운 맵이라고 판단한다.
    if let None = map.id {
        let insert_result = maps.insert_one(map, None).await?;

        let result_id = insert_result
            .inserted_id
            .as_object_id()
            .ok_or("삽입된 ID를 가져오지 못했습니다.")?;

        let map = maps
            .find_one(doc! {"_id": result_id}, None)
            .await?
            .ok_or("맵을 찾지 못했습니다")?;

        Ok(map)
    } else {

        // session 생성
        let mut session = client.start_session(None).await?;

        // `db`에서 MongoDB 클라이언트를 가져옴
        // 맵이 존재했을 때, 저장 ( 일괄 삭제 및 추가 ), 트랜잭션으로 일관성을 보장한다
        // 트랜잭션 시작
        session.start_transaction(None).await?;

        let filter = doc! {"_id": map.id};

        let unset = doc! {
          "$unset" : { "title": "", "body": "", "marks": "" }
        };

        maps.update_one_with_session(filter.clone(), unset, None, &mut session)
            .await?;

        let marks_bson_value = bson::to_bson(&map.marks)?;

        let set = doc! {
          "$set": {"title": map.title, "body": map.body, "marks": marks_bson_value}
        };

        maps.update_one_with_session(filter.clone(), set, None, &mut session)
            .await?;

        let update_map = maps
            .find_one_with_session(filter.clone(), None, &mut session)
            .await?
            .ok_or("업데이트 된 맵을 찾지 못했습니다")?;

        session.commit_transaction().await?;

        Ok(update_map)
    }
}

