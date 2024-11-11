use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

// 맵 객체
// id: 맵의 고유 Id,
// user_id: 맵을 저장한 유저의 고유 Id,
// title: 맵의 제목
// body: 맵에 대한 간략한 설명
// marks: 맵을 이루고 있는 마커들
#[derive(Debug, Serialize, Deserialize)]
pub struct Map {
    // none이라면 직렬화를 스킵한다. 
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub user_id: ObjectId,
    pub title: String,
    pub body: String,
    pub marks: Vec<Mark>,
}

impl Map {
    pub fn new_with_req(user_id: ObjectId, map_save_req: MapSaveReq) -> Self {
        Self {
            id: map_save_req.id,
            title: map_save_req.title,
            user_id: user_id,
            body: map_save_req.body,
            marks: map_save_req.marks,
        }
    }
}

// 맵 저장시의 객체
// id: 맵의 고유 ID (맵을 새로 저장할 때는 None, Edit일 경우 값이 존재)
// title: 맵의 이름
// body: 맵 설명
// marks: 맵 마커들
#[derive(Debug, Deserialize, Serialize)]
pub struct MapSaveReq {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub body: String,
    pub marks: Vec<Mark>,
}

// urls: 이미지의 걍로
// title: 마커의 제목
// body: 마커의 설명
// point: 마커의 좌표
#[derive(Debug, Deserialize, Serialize, PartialEq)]
pub struct Mark {
    pub urls: Vec<String>,
    pub title: String,
    pub body: String,
    pub point: (f64, f64),
}

// #[derive(Debug, Deserialize, Serialize)]
// pub struct ImageData {
//     pub url: String,
//     pub isNew: bool,
//     pub isDeleted: bool,
// }

#[derive(Debug, Serialize)]
pub struct MapSearchRes {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub title: String,
    pub body: String,
    pub is_edit: bool,
}

#[derive(Debug, Deserialize)]
pub struct MapReadReq {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: ObjectId,
}

#[derive(Debug, Serialize)]
pub struct MapReadRes {
    pub map: MapSaveReq,
    pub is_edit: bool,
}
