/**
 * 이메일 유효성 검사 함수
 * @param email 검사할 이메일 주소
 * @returns 유효한 이메일 형식인지 여부를 반환
 */
export const isValidEmail = (email: string): boolean => {
    // 정규식을 사용하여 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  