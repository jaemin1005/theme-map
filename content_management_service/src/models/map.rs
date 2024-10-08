use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Map {
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

#[derive(Debug, Deserialize, Serialize)]
pub struct MapSaveReq {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub title: String,
    pub body: String,
    pub marks: Vec<Mark>,
}

#[derive(Debug, Deserialize, Serialize)]
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

