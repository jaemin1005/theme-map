use serde::Serialize;

#[derive(Serialize)]
pub struct UploadImgRes {
  pub img_urls : Vec<String>,
}