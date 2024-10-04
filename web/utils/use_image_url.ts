import { ImageData } from "@/interface/content.dto";
import { useEffect, useState } from "react";

/**
 * 이미지를 표시하기 위한 URL을 생성하고 관리하는 Custom Hook
 * @param imageData Blob 또는 URL을 포함하는 이미지 데이터
 * @returns 이미지를 표시하기 위한 URL
 */
export const useImageUrl = (imageData: ImageData) => {
  
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const revokeUrl = getImageUrl(imageData, setUrl);

    // URL 해제를 위해 반환된 함수 실행
    return () => {
      if (revokeUrl) revokeUrl();
    };
  }, [imageData]);

  return url;
};

/**
 * 여러 개의 ImageData 배열을 처리하여 각 이미지의 URL을 관리하는 Custom Hook.
 * @param imageDatas - Blob 또는 URL을 포함하는 이미지 데이터 배열.
 * @returns 이미지 URL 배열 
 */
export const useImageUrls = (imageDatas: ImageData[]) => {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    // URL을 저장할 배열과 메모리 해제를 위한 해제 함수 배열
    const revokeUrls: (() => void)[] = [];

    // 각 ImageData에 대해 URL을 생성하고 관리
    const newUrls = imageDatas.map((imageData) => {
      if (imageData.url) {
        return imageData.url;
      } else if (imageData.blob) {
        const url = URL.createObjectURL(imageData.blob);
        revokeUrls.push(() => URL.revokeObjectURL(url));
        return url;
      }
      return ""
    });

    setUrls(newUrls); // URL 배열을 상태로 설정

    // 컴포넌트가 언마운트될 때 모든 URL을 해제하여 메모리 누수를 방지
    return () => {
      revokeUrls.forEach((revoke) => revoke());
    };
  }, [imageDatas]);

  return urls;
};

/**
 * mageData를 통해 url를 설정하는 클로저함수,
 * @param imageData ImageData
 * @param setUrl url 상태 설정하는 훅
 * @returns url을 해제하는 함수를 반환
 */
const getImageUrl = (imageData: ImageData, setUrl: (url: string) => void) => {

  if(!imageData) return

  if (imageData.url) {
    setUrl(imageData.url);
  } else if (imageData.blob) {
    const url = URL.createObjectURL(imageData.blob);
    setUrl(url);

    // 메모리 누수 방지용 URL 해제
    return () => {
      URL.revokeObjectURL(url);
    };
  }
};
