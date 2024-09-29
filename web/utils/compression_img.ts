import imageCompression from "browser-image-compression";

/**
 * 이미지를 압축하고 WebP로 변환하는 함수
 * @param file 이미지 파일
 * @returns WebP로 변환된 Blob 객체
 */
export const compressAndConvertToWebP = async (file: File): Promise<Blob> => {
  try {
    // 이미지 압축
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    const compressedFile = await imageCompression(file, options);

    // 압축된 이미지를 WebP로 변환
    const webpBlob = await convertToWebP(compressedFile);
    return webpBlob;
  } catch (error) {
    console.error("이미지 압축 및 WebP 변환 실패:", error);
    throw error;
  }
};

/**
 * 파일을 WebP 형식으로 변환하는 함수
 * @param file 압축된 이미지 파일
 * @returns WebP로 변환된 Blob 객체
 */
const convertToWebP = (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);

          // Canvas API를 사용하여 WebP로 변환
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("WebP 변환 실패"));
              }
            },
            "image/webp",
          );
        } else {
          reject(new Error("Canvas context를 가져올 수 없습니다."));
        }
      };
      img.src = event.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("이미지 파일 읽기 실패"));
    };

    reader.readAsDataURL(file);
  });
};
