use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

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
