use std::env::VarError;

use super::err::ErrorRes;
use actix_web::http::header::ToStrError;
use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use aws_sdk_s3::error::SdkError;
use aws_sdk_s3::operation::copy_object::CopyObjectError;
use aws_sdk_s3::operation::delete_object::DeleteObjectError;

use jsonwebtoken::errors::Error as JwtError;
use mongodb::bson::oid::Error as BsonError;
use mongodb::bson::ser::Error as BsonSerdeError;
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

    #[error("Actix Web ToStrError: {0}")]
    ToStrError(#[from] ToStrError),

    #[error("Env Error: {0}")]
    EnvError(#[from] VarError),

    #[error("S3 Copy Error: {0}")]
    S3CopyError(#[from] SdkError<CopyObjectError>),

    #[error("S3 delete Error: {0}")]
    S3DeleteError(#[from] SdkError<DeleteObjectError>),

    #[error("Bson Serde Parsing Error: {0}")]
    BsonSerdeParsingError(#[from] BsonSerdeError),

    #[error("Invalid Path")]
    InvalidPath,

    #[error("User Not Founded")]
    UserNotFound,

    #[error("Map Not Founded")]
    MapNotFound,

    #[error("ObjectId Not Founded")]
    ObjectIdNotFound,

    #[error("Invalid Access Error")]
    InvalidAceessError,

    #[error("Invalide Authoriztion Header")]
    InvalidAuthorizationHeader,

    #[error("File Name Not Found")]
    FileNameNotFound,
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::DatabaseError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::BsonError(_) => StatusCode::BAD_REQUEST,
            AppError::JwtError(_) => StatusCode::UNAUTHORIZED,
            AppError::ToStrError(_) => StatusCode::BAD_REQUEST,
            AppError::EnvError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::S3CopyError(_) => StatusCode::BAD_REQUEST,
            AppError::S3DeleteError(_) => StatusCode::BAD_REQUEST,
            AppError::BsonSerdeParsingError(_) => StatusCode::BAD_REQUEST,
            AppError::UserNotFound => StatusCode::NOT_FOUND,
            AppError::MapNotFound => StatusCode::NOT_FOUND,
            AppError::ObjectIdNotFound => StatusCode::NOT_FOUND,
            AppError::InvalidAceessError => StatusCode::FORBIDDEN,
            AppError::InvalidAuthorizationHeader => StatusCode::BAD_REQUEST,
            AppError::FileNameNotFound => StatusCode::BAD_REQUEST,
            AppError::InvalidPath => StatusCode::BAD_REQUEST,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let error_response = ErrorRes::new(self.to_string(), None);
        HttpResponse::build(self.status_code()).json(error_response)
    }
}
