use mongodb::Database;
use mongodb::bson::{doc, oid::ObjectId};
use crate::models::user::User;


// _id를 통해 유저 이메일을 가지고 온다
pub async fn get_user_email_by_id(user_id: &str, db: &Database) -> Result<String, Box<dyn std::error::Error>> {
  let users = db.collection::<User>("users");

  let object_id = ObjectId::parse_str(user_id)?;

  let user = users
      .find_one(doc! { "_id": object_id }, None)
      .await?
      .ok_or("사용자를 찾을 수 없습니다.")?;

  Ok(user.email)
}
