use super::err::ErrorRes;
use actix_web::http::header::ToStrError;
use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use bcrypt::BcryptError;
use chrono::ParseError;
use jsonwebtoken::errors::Error as JwtError;
use mongodb::bson::oid::Error as BsonError;
use mongodb::error::Error as MongoError;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("DB Error: {0}")]
    DatabaseError(#[from] MongoError),

    #[error("Bson Error: {0}")]
    BsonError(#[from] BsonError),

    #[error("JWT Error: {0}")]
    JwtError(#[from] JwtError),

    #[error("Date Parsing Error: {0}")]
    DateParseError(#[from] ParseError),

    #[error("Bcyrpt Error: {0}")]
    BcryptError(#[from] BcryptError),

    #[error("Actix Web ToStrError: {0}")]
    ToStrError(#[from] ToStrError),

    #[error("User Not Founded")]
    UserNotFound,

    #[error("Email Already Exists")]
    EmailAlreadyExists,

    #[error("Invalide Crendentials")]
    InvalidCredentials,

    #[error("Missing RefreshToken")]
    MissingRefreshToken,

    #[error("Invalide Authoriztion Header")]
    InvalidAuthorizationHeader,

    #[error("Token Not Found")]
    TokenNotFound,

    #[error("Invalid Device-ID Header")]
    InvalidDeviceIdHeader,

    #[error("User Id Not Founded")]
    UserIdNotFound,
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::DatabaseError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::BsonError(_) => StatusCode::BAD_REQUEST,
            AppError::JwtError(_) => StatusCode::UNAUTHORIZED,
            AppError::DateParseError(_) => StatusCode::BAD_REQUEST,
            AppError::BcryptError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::ToStrError(_) => StatusCode::BAD_REQUEST,
            AppError::UserNotFound => StatusCode::NOT_FOUND,
            AppError::EmailAlreadyExists => StatusCode::CONFLICT,
            AppError::InvalidCredentials => StatusCode::UNAUTHORIZED,
            AppError::MissingRefreshToken => StatusCode::BAD_REQUEST,
            AppError::InvalidAuthorizationHeader => StatusCode::BAD_REQUEST,
            AppError::InvalidDeviceIdHeader => StatusCode::BAD_REQUEST,
            AppError::TokenNotFound => StatusCode::UNAUTHORIZED,
            AppError::UserIdNotFound => StatusCode::NOT_FOUND,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let error_response = ErrorRes::new(self.to_string(), None);
        HttpResponse::build(self.status_code()).json(error_response)
    }
}
