use serde::Deserialize;
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Deserialize)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    id: Option<ObjectId>,
    name: String,
    pub email: String,
    password: String,
}