import { IsString } from "class-validator";

export class ObjectId {
  @IsString()
  $oid!: string
}