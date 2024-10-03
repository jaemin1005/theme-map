use actix_web::HttpRequest;
use crate::utils::jwt;

pub fn get_user_info(
  req: &HttpRequest,
) -> Result<String, Box<dyn std::error::Error>> {

  // Authorization 헤더에서 액세스 토큰 추출
  let auth_header = req
      .headers()
      .get("Authorization")
      .ok_or("Authorization 헤더가 없습니다.")?
      .to_str()?;

  if !auth_header.starts_with("Bearer ") {
      return Err("잘못된 Authorization 헤더입니다.".into());
  }

  let token = &auth_header[7..]; // "Bearer " 부분 제거

  // 액세스 토큰 검증
  let token_data = jwt::verify_access_token(token)?;

  let user_id = token_data.claims.sub;

  Ok(user_id)
} 