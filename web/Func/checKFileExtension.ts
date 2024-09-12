/**
 * * 파일 확장자 체크
 * @param files : 허용할 파일 확장자 모음
 * @returns 
 */
export const checkFileExtensions = (...files: string[]) => {
  return (filePath: string) => {
    const file = getFileExtnsion(filePath);

    if (file) {
      return files.includes(file);
    } else {
      return false;
    }
  };
};

/**
 * * 파일 확장자 가져오는 함수
 * @param fileName : 파일 이름
 * @returns
 */
const getFileExtnsion = (fileName: string) => {
  const fileExtension = fileName.split(".").pop();
  if (fileExtension === undefined) return false;
  else return fileExtension.toLowerCase();
};
