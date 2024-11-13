use crate::{models::app_err::AppError, utils::jwt};
use actix_web::HttpRequest;

pub fn get_user_info(req: &HttpRequest) -> Result<String, AppError> {
    // Authorization 헤더에서 액세스 토큰 추출
    let auth_header = req
        .headers()
        .get("Authorization")
        .ok_or(AppError::InvalidAuthorizationHeader)?
        .to_str()?;

    if !auth_header.starts_with("Bearer ") {
        return Err(AppError::InvalidAuthorizationHeader);
    }

    let token = &auth_header[7..]; // "Bearer " 부분 제거

    // 액세스 토큰 검증
    let token_data = jwt::verify_access_token(token)?;

    let user_id = token_data.claims.sub;

    Ok(user_id)
}
