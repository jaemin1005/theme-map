import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import "reflect-metadata"
import { ObjectId } from "./objectId";

export class ImageData {
  @Type(() => Blob)
  @IsOptional()
  blob?: Blob;

  @IsString()
  @IsOptional()
  url?: string;

  @IsNotEmpty()
  @IsBoolean()
  isNew!: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isDeleted!: boolean
}

export class Mark {
  @IsArray()
  @IsString({each: true})
  urls!: string[];

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsString()
  body!: string;
  
  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, {each: true})
  point!: [number, number];
}

export class MapSaveReq {

  @Type(() => ObjectId)
  @IsOptional()
  _id?: ObjectId;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  body!: string;

  // @IsNotEmpty()
  // @IsBoolean()
  // isNew!: boolean

  // @IsNotEmpty()
  // @IsBoolean()
  // isEdited!: boolean

  @IsArray() // 배열 타입인지 확인
  @ValidateNested({ each: true }) // 배열의 각 요소에 대해 유효성 검사를 수행
  @Type(() => Mark) // MarkerInfo 클래스로 변환
  marks!: Mark[]
}

export interface MapSaveRes {
  _id: string,
}

export interface MapSearchMeRes {
  _id: ObjectId,
  title: string,
  body: string,
  is_edit: boolean,
}

export class MapReadReq {
  @Type(() => ObjectId)
  @ValidateNested()
  _id!: ObjectId
}

export interface MapReadRes {
  map: MapSaveReq;
  is_edit: boolean;
}