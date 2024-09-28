/**
 * 이미지 파일을 url로 변경하는 로직
 * @param file 이미지 파일
 * @returns
 */
export const fileToUrl = (file: File | Blob) => {
  const url = URL.createObjectURL(file);
  return url;
};
