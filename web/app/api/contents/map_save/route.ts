// app/api/save-map/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MapSaveReq, MarkerInfo } from "@/interface/content.dto";
import { IncomingForm } from "formidable";
import { validateOrReject } from "class-validator";
import { Readable } from "stream";
//import { uploadFileToS3 } from 'your-s3-service';

// https://stackoverflow.com/questions/66674834/how-to-read-formdata-in-nextjs
export async function POST(req: NextRequest) {
  const formData = await req.formData();
}


// import { MapSaveReq, MapSaveSeviceReq, MarkerServiceInfo } from "@/interface/content.dto";
// import { ERROR_MSG } from "@/static/log/error_msg";
// import { validateOptions } from "@/static/validate_option";
// import { plainToInstance } from "class-transformer";
// import { validateSync } from "class-validator";
// import { NextRequest, NextResponse } from "next/server";
// import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";
// import { generateUniqueName } from "@/utils/generate_unique_name";
// import { s3 } from "@/static/aws/s3_client";
// import multer from "multer";
// import { promisify } from "util";

// 맵을 저장하는 POST Route
// export async function POST(req: NextRequest) {
//   // Authorization 헤더에서 액세스 토큰 가져오기
//   const authHeader = req.headers.get("authorization");

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json(
//       { message: "인증 토큰이 없습니다." },
//       { status: 401 }
//     );
//   }

//   const requestData = (await req.json()) as MapSaveReq;

//   const mapSaveReq = plainToInstance(MapSaveReq, requestData);
//   const errors = validateSync(mapSaveReq, validateOptions);

//   if (errors.length > 0) {
//     return NextResponse.json(
//       {
//         message: ERROR_MSG.REGISTER_VALIDATE_FAIL,
//         details: errors.map((err) => err.toString()),
//       },
//       { status: 400 }
//     );
//   }

//   try {
//     const markSeviceInfo: MarkerServiceInfo[] = await Promise.all(mapSaveReq.marker_infos.map(async (marker) => {

//       const imgUrls = await Promise.all(marker.blobs.map(async (blob, index) => {
//         const uniqueFileName = await generateUniqueName(blob);

//         const uploadParams = {
//           Bucket: process.env.AWS_S3_BuCKET_NAME,
//           Key: `images/${uniqueFileName}-${index}`,
//           Body: blob,
//           ContentType: "image/webp",
//           ACL: ObjectCannedACL.public_read, // 퍼블릭 읽기 권한 설정
//         }

//         const command = new PutObjectCommand(uploadParams)
//         await s3.send(command);

//         // 업로드된 파일의 URL 생성
//         const imgUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${uniqueFileName}-${index}`;
//         return imgUrl;
//       }))

//       return {
//         urls: imgUrls,
//         title: marker.title,
//         body: marker.body,
//         point: marker.point
//       }
//     }));

//     const mapSaveSeviceReq: MapSaveSeviceReq = {
//       title: mapSaveReq.title,
//       body: mapSaveReq.body,
//       marker_infos: markSeviceInfo
//     }

//     /**
//      * map Service 처리가 필요하당
//      */
//     return NextResponse.json(
//       {
//         message: "맵이 성공적으로 저장되었습니다.",
//         markerInfos: mapSaveReq.marker_infos,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("S3 업로드 중 오류 발생:", error);
//     return NextResponse.json(
//       { message: "파일 업로드 중 오류가 발생했습니다." },
//       { status: 500 }
//     );
//   }
// }
