import Image from "next/image";
import { Popup } from "react-leaflet";
import "./popup.css";

interface CustomPopupProps {
  file: File;
  title: string;
  body: string;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({
  file,
  title,
  body,
}) => {
  // 파일 Url로 변환
  const fileToUrl = (file: File) => {
    const url = URL.createObjectURL(file);
    return url;
  };

  return (
    <Popup className="custom-popup">
      <div className="h-full flex flex-row min-w-[300px] max-w-[600px] gap-x-2">
        {file && (
          <Image
            width={100}
            height={100}
            src={fileToUrl(file)}
            alt="이미지"
            objectFit="fit"
            className="rounded-md"
          ></Image>
        )}
        <div className="w-full overflow-hidden">
          <h2 className="font-extrabold text-medium whitespace-nowrap">
            {title}
          </h2>
          <p className="mt-2 text-wrap">{body}</p>
        </div>
      </div>
    </Popup>
  );
};
