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

/**
 * 특수문자 들어가 있는지 확인
 * @param str 확인할 문자열
 * @returns 
 */
export const hasContainSpecialCharacters = (str: string): boolean => {
  // 정규식을 사용하여 특수문자 검출
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/g;
  return specialCharPattern.test(str);
};

/**
 * 문자열 길이 유효성 검사
 * @param str 문자열
 * @param min 최소 길이
 * @param max 최대 길이
 * @returns 길이 유효성 통과 여부
 */
export const isCheckMinMaxLength = (str: string, min: number, max: number): boolean => {
  const length = str.length;

  if(length >= min && length <= max) {
    return true;
  }

  return false;
}