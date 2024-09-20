use bcrypt::{hash, verify, BcryptError};

// 패스워드 해쉬로 암호화
pub fn hash_password(password: &str) -> Result<String, BcryptError> {
    hash(password, bcrypt::DEFAULT_COST)
}

// 패스워드를 암호화된 패스워드랑 비교
pub fn verify_password(password: &str, hashed_password: &str) -> Result<bool, BcryptError> {
    verify(password, hashed_password)
}
