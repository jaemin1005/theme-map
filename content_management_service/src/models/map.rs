use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Map {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub email: String,
    pub body: String,
    pub marks: Vec<Mark>,
}

impl Map {
    pub fn new_with_req(user_id: &str, map_save_req: MapSaveReq) -> Self {
        Self {
            id:  map_save_req.id,
            email: user_id.to_string(),
            body: map_save_req.body,
            marks: map_save_req.marks
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
    pub imageDatas: Vec<ImageData>,
    pub title: String,
    pub body: String,
    pub point: (f64, f64),
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ImageData {
    pub url: String,
    pub isNew: bool,
    pub isDeleted: bool,
}

// #[derive(Serialize)]
// pub struct MapSaveRes {
//     #[serde(rename = "_id")]
//     pub id: ObjectId,
// }

// impl MapSaveRes {
//     pub fn new(id: ObjectId) -> Self {
//         Self {
//             id,
//         }
//     }
// }