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
    pub likes: Vec<ObjectId>,
    pub marks: Vec<Mark>,
}

impl Map {
    pub fn new_with_details(user_id: ObjectId, map_details: MapDetails) -> Self {
        Self {
            id: map_details.id,
            title: map_details.title,
            user_id: user_id,
            body: map_details.body,
            marks: map_details.marks,
            likes: map_details.likes
        }
    }
}

// 맵 저장시의 객체
// id: 맵의 고유 ID (맵을 새로 저장할 때는 None, Edit일 경우 값이 존재)
// title: 맵의 이름
// body: 맵 설명
// marks: 맵 마커들
#[derive(Debug, Deserialize, Serialize)]
pub struct MapDetails {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub body: String,
    pub marks: Vec<Mark>,
    pub likes: Vec<ObjectId>,
}

impl MapDetails {
    pub fn new_with_map(map: Map) -> Self {
        Self {
            id: map.id,
            title: map.title,
            body: map.body,
            marks: map.marks,
            likes: map.likes,
        }
    }
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
pub struct MapSearchResult {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub title: String,
    pub body: String,
    pub is_edit: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MapId {
    #[serde(rename = "_id")]
    pub id: ObjectId,
}

impl MapId {
    pub fn new(id: ObjectId) -> Self {
        Self { id }
    }
}

#[derive(Debug, Serialize)]
pub struct MapReadRes {
    pub map: MapDetails,
    pub is_edit: bool,
}
