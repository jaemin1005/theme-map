use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorRes {
    pub message: String,
    pub detail: Option<String>,
}

impl ErrorRes{
    pub fn new(message: String, detail: Option<String>) -> Self {
        Self { message, detail }
    }
}
