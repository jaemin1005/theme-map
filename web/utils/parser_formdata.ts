import { MapSaveReq, Mark } from "@/interface/content.dto";

/**
 * FormData의 키를 파싱하여 중첩된 객체 경로를 추출
 * 예: "marks[0][title]" => ["marks", "0", "title"]
 */
const parseKey = (key: string): string[] => {
  const regex = /([^[\]]+)/g;
  const matches = key.match(regex);
  return matches ? matches : [];
};

/**
 * FormData를 MapSaveReq 객체로 변환합니다.
 * @param formData FormData 객체 ( MasSaveReq -> FormData로 변환 )
 * @returns 변환된 MapSaveReq 객체
 */
export const parseFormDataToMapSaveReq = async (formData: FormData): Promise<MapSaveReq> => {
  const mapSaveReq: Partial<MapSaveReq> = {};
  const marksMap: { [key: number]: Partial<Mark> } = {};

  // FormData의 모든 키-값 쌍을 순회합니다.
  for (const [key, value] of formData.entries()) {
    const keys = parseKey(key);
    
    if (keys.length === 1) {
      // 최상위 필드
      if (keys[0] === "_id") {
        mapSaveReq._id = value as string;
      } else if (keys[0] === "title") {
        mapSaveReq.title = value as string;
      } else if (keys[0] === "body") {
        mapSaveReq.body = value as string;
      }
      // 추가적인 최상위 필드가 있다면 여기에 처리
    } else if (keys[0] === "marks") {
      const markIndex = parseInt(keys[1], 10);
      if (!marksMap[markIndex]) {
        marksMap[markIndex] = { imageDatas: [] };
      }

      const mark = marksMap[markIndex];

      if (keys[2] === "title") {
        mark.title = value as string;
      } else if (keys[2] === "body") {
        mark.body = value as string;
      } else if (keys[2] === "point") {
        mark.point = JSON.parse(value as string);
      } else if (keys[2] === "imageDatas") {
        const imageIndex = parseInt(keys[3], 10);
        if (!mark.imageDatas) {
          mark.imageDatas = [];
        }
        if (!mark.imageDatas[imageIndex]) {
          mark.imageDatas[imageIndex] = { isNew: false, isDeleted: false }
        }

        const imageData = mark.imageDatas[imageIndex];

        if (keys[4] === "blob") {
          // Blob은 파일로 처리
          imageData.blob = value as Blob;
        } else if (keys[4] === "isNew") {
          imageData.isNew = value === "true";
        } else if (keys[4] === "isDeleted") {
          imageData.isDeleted = value === "true";
        } else if (keys[4] === "url") {
          imageData.url = value as string;
        }
      }
    }
  }

  // marksMap을 marks 배열로 변환
  mapSaveReq.marks = Object.keys(marksMap)
    .map(key => parseInt(key, 10))
    .sort((a, b) => a - b)
    .map(index => marksMap[index] as Mark);

  // TypeScript 타입 강제 변환
  return mapSaveReq as MapSaveReq;
};
