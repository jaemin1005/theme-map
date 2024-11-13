use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorRes {
    pub message: String,
}

impl ErrorRes {
    pub fn new(message: String) -> Self {
        Self { message }
    }
}
