const validImageTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"];

/**
 * MIME 타입을 통해 유효한 이미지인지 검사
 * @param file : 업로드 파일
 * @returns 
 */
export const validateImage = (file: File) => {
  return validImageTypes.includes(file.type);
};
