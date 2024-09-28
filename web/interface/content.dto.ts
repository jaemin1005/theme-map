import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInstance, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";

export class MapSaveReq {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  body!: string;

  @IsArray() // 배열 타입인지 확인
  @ValidateNested({ each: true }) // 배열의 각 요소에 대해 유효성 검사를 수행
  @Type(() => MarkerInfo) // MarkerInfo 클래스로 변환
  marker_infos!: MarkerInfo[]
}

class MarkerInfo {
  @IsInstance(Blob) // Blob 객체인지 확인
  @IsNotEmpty() // Blob이 비어있지 않은지 확인 (선택적으로 추가)
  blob!: Blob;
  
  @IsString()
  @IsNotEmpty()
  title!: string;
  
  @IsString()
  body!: string;

  @IsArray() // 배열인지 확인
  @ArrayMinSize(2) // 배열 길이가 2인지 확인
  @IsNumber({}, { each: true }) // 배열의 각 요소가 숫자인지 확인
  position!: [number, number]
}
