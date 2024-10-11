use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct UploadImgRes {
  pub img_urls : Vec<String>,
}