use actix_web::HttpRequest;

use crate::models::{
    app_err::AppError,
    user::{User, UserRes},
};

pub fn user_to_user_res(user: User) -> UserRes {
    UserRes {
        email: user.email,
        name: user.name,
    }
}

pub fn get_user_device_id(req: &HttpRequest) -> Result<String, AppError> {
    // Authorization 헤더에서 액세스 토큰 추출
    let device_id = req
        .headers()
        .get("Device-ID")
        .ok_or(AppError::InvalidDeviceIdHeader)?
        .to_str()?;

    if device_id == "" {
        return Err(AppError::InvalidDeviceIdHeader);
    }

    Ok(device_id.to_string())
}
