use std::env::VarError;

use actix_web::{body::BoxBody, http::StatusCode, HttpResponse, ResponseError};
use aws_sdk_s3::{error::SdkError, operation::put_object::PutObjectError};
use thiserror::Error;

use super::err::ErrorRes;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Env Error: {0}")]
    EnvError(#[from] VarError),

    #[error("File Name Not Found")]
    FileNameNotFound,

    #[error("File MetaData Not Found")]
    MetaDataNotFound,

    #[error("S3 Put Error: {0}")]
    S3PutError(#[from] SdkError<PutObjectError>),
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::EnvError(_) => StatusCode::INTERNAL_SERVER_ERROR,
            AppError::FileNameNotFound => StatusCode::BAD_REQUEST,
            AppError::MetaDataNotFound => StatusCode::BAD_REQUEST,
            AppError::S3PutError(_) => StatusCode::BAD_REQUEST,
        }
    }

    fn error_response(&self) -> HttpResponse<BoxBody> {
    
        let error_response = ErrorRes::new(self.to_string());
        HttpResponse::build(self.status_code()).json(error_response)
    }
}