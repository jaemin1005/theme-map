// app/api/save-map/route.ts

import { NextRequest, NextResponse } from "next/server";
import { parseFormDataToMapSaveReq } from "@/utils/parser_formdata";
import { ImageData, MapSaveReq, Mark } from "@/interface/content.dto";
import { plainToInstance } from "class-transformer";
import { validateOptions } from "@/static/validate_option";
import { validateSync } from "class-validator";
import { ERROR_MSG } from "@/static/log/error_msg";
import { generateUniqueName } from "@/utils/generate_unique_name";
import {
  DeleteObjectCommand,
  ObjectCannedACL,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3 } from "@/static/aws/s3_client";
//import { uploadFileToS3 } from 'your-s3-service';

// https://stackoverflow.com/questions/66674834/how-to-read-formdata-in-nextjs
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }

  const formData = await req.formData();
  const body = await parseFormDataToMapSaveReq(formData);

  const mapSaveReq = plainToInstance(MapSaveReq, body);
  const errors = validateSync(mapSaveReq, validateOptions);

  if (errors.length > 0) {
    return NextResponse.json(
      {
        message: ERROR_MSG.REGISTER_VALIDATE_FAIL,
        details: errors.map((err) => err.toString()),
      },
      { status: 400 }
    );
  }
  const mark: Mark[] = await Promise.all(
    mapSaveReq.marks.map(async (mark) => {
      // {url: string, isNew: boolean, isDeleted: boolean}
      const data: ImageData[] = (
        await Promise.all(
          mark.imageDatas.map(async (imageData, index) => {
            if (imageData.isNew && imageData.blob) {
              try {
                const arrayBuffer = await imageData.blob.arrayBuffer();

                const uniqueFileName = await generateUniqueName(arrayBuffer);

                const uploadParams = {
                  Bucket: process.env.AWS_S3_BUCKET_NAME,
                  Key: `images/${uniqueFileName}-${index}`,
                  Body: Buffer.from(arrayBuffer),
                  ContentType: "image/webp",
                  ACL: ObjectCannedACL.public_read,
                  Resource: `arn:aws:s3:::${process.env.AWS_S3_BUCKET_NAME}/images/`
                };

                const command = new PutObjectCommand(uploadParams);
                await s3.send(command);

                // 업로드된 파일의 URL 생성
                const imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}-${index}`;
                return {
                  url: imgUrl,
                  isNew: imageData.isNew,
                  isDeleted: imageData.isDeleted,
                };
              } catch (error) {
                console.error("S3 업로드 중 오류 발생:", error);
                throw new Error()
              }
            } else if (imageData.isDeleted && imageData.url) {
              try {
                // URL에서 Bucket 이름과 Key 추출
                // 예: 'mybucket.s3.region.amazonaws.com'에서 'mybucket' 추출
                // 예: '/uploads/uniqueFileName-0.webp'에서 'uploads/uniqueFileName-0.webp' 추출
                const url = new URL(imageData.url);
                const bucketName = url.hostname.split(".")[0];
                const key = decodeURIComponent(url.pathname.substring(1));

                const deleteParams = {
                  Bucket: bucketName,
                  Key: key,
                };

                const deleteCommand = new DeleteObjectCommand(deleteParams);
                await s3.send(deleteCommand);

                console.log(
                  `Deleted S3 object: ${key} from bucket: ${bucketName}`
                );

                return {
                  url: imageData.url,
                  isNew: imageData.isNew,
                  isDeleted: imageData.isDeleted,
                };
              } catch (error) {
                console.error(
                  `Error deleting S3 object: ${imageData.url}`,
                  error
                );
                throw new Error("Failed to delete image from S3");
              }
            }
          })
        )
      ).filter((data) => data !== undefined);

      return {
        imageDatas: data,
        title: mark.title,
        body: mark.body,
        point: mark.point,
      };
    })
  );

  return NextResponse.json({ message: "맵 저장 완료" }, { status: 200 });
}
