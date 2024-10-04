use crate::models::user::{User, UserRes};

pub fn user_to_user_res(user: User) -> UserRes {
  UserRes {
    email: user.email,
    name: user.name
  }
}