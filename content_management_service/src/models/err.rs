use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct ErrorRes<'a> {
    pub message: &'a str,
}

impl<'a> ErrorRes<'a> {
    pub fn new(message: &'a str) -> Self {
        Self { message: message }
    }
}
