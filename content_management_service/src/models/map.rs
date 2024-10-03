use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize)]
pub struct MapSaveReq {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,
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

#[derive(Serialize)]
pub struct MapSaveRes {
    #[serde(rename = "_id")]
    pub id: String,
}

impl MapSaveRes {
    pub fn new(id: String) -> Self {
        Self {
            id,
        }
    }
}

