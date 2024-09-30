import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInstance, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import "reflect-metadata"

export interface ImageData {
  blob?: Blob;
  url?: string;
  isNew: boolean;
  isDeleted: boolean;
}

// 각 마크의 상세정보를 담기위한 인터페이스
export interface Mark {
  imageDatas: ImageData[];
  title: string;
  body: string;
  point: [number, number]
}

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

export class MarkerInfo {
  @IsArray() // 배열 타입인지 확인
  @IsInstance(Blob, { each: true }) // 배열의 각 요소가 Blob 타입인지 확인
  @IsNotEmpty() // Blob 배열이 비어있지 않은지 확인
  blobs!: Blob[];
  
  @IsString()
  @IsNotEmpty()
  title!: string;
  
  @IsString()
  body!: string;

  @IsArray() // 배열인지 확인
  @ArrayMinSize(2) // 배열 길이가 2인지 확인
  @IsNumber({}, { each: true }) // 배열의 각 요소가 숫자인지 확인
  point!: [number, number]
}

export class MapSaveSeviceReq {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  body!: string;

  @IsArray()
  //@ValidateNested({ each: true })
  //@Type(() => MarkerServiceInfo)
  marker_infos!: MarkerServiceInfo[];
}

export class MarkerServiceInfo {
  @IsArray()
  @IsString({ each: true }) 
  urls!: string[];

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  body!: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  point!: [number, number];
}