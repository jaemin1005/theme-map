import { MapSaveReq } from "@/interface/content.dto";

export const createFormDataFromMapSaveReq = (mapSaveReq: MapSaveReq): FormData => {
  const formData = new FormData();

  if(mapSaveReq._id){
    formData.append("_id", mapSaveReq._id)
  }

  // 텍스트 필드 추가
  formData.append("title", mapSaveReq.title);
  formData.append("body", mapSaveReq.body);
  // formData.append("isNew", transBooleanToString(mapSaveReq.isNew));
  // formData.append("isEdited", transBooleanToString(mapSaveReq.isEdited));

  // Mark 배열 처리
  mapSaveReq.marks.forEach((mark, markIndex) => {
    formData.append(`marks[${markIndex}][title]`, mark.title);
    formData.append(`marks[${markIndex}][body]`, mark.body);
    formData.append(`marks[${markIndex}][point]`, JSON.stringify(mark.point));

    // ImageData 배열 처리
    mark.imageDatas.forEach((imageData, imageIndex) => {
      if (imageData.isNew && imageData.blob) {
        // 새로운 이미지 전송 및 수정된 이미지
        formData.append(`marks[${markIndex}][imageDatas][${imageIndex}][blob]`, imageData.blob, `image_${markIndex}_${imageIndex}.png`);
        formData.append(`marks[${markIndex}][imageDatas][${imageIndex}][isNew]`, "true");
        formData.append(`marks[${markIndex}][imageDatas][${imageIndex}][isDeleted]`, "false");
      } else if (imageData.isDeleted) {
        // 삭제된 이미지 처리
        formData.append(`marks[${markIndex}][imageDatas][${imageIndex}][isNew]`, "false");
        formData.append(`marks[${markIndex}][imageDatas][${imageIndex}][isDeleted]`, "true");
      } else if (imageData.url) {
        // 기존 URL 전송
        formData.append(`marks[${markIndex}][imageDatas][${imageIndex}][isNew]`, "false");
        formData.append(`marks[${markIndex}][imageDatas][${imageIndex}][isDeleted]`, "false");
      }
    });
  });

  return formData;
};


// const transBooleanToString = (bool: boolean): "true" | "false" => {
//   return bool ? "true" : "false"
// } 