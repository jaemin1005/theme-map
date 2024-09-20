use bcrypt::{hash, verify, BcryptError};

// 패스워드 해쉬로 암호화
// bcrypt::DEFAULT_COST의 기본값은 12. 이 숫자는 해시 연산을 2^12 (4096)번 반복하여 해시 값을 계산함을 의미
pub fn hash_password(password: &str) -> Result<String, BcryptError> {
    hash(password, bcrypt::DEFAULT_COST)
}

// 패스워드를 암호화된 패스워드랑 비교
pub fn verify_password(password: &str, hashed_password: &str) -> Result<bool, BcryptError> {
    verify(password, hashed_password)
}

