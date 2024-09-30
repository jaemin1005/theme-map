import Image from "next/image";
import { Popup } from "react-leaflet";
import "./popup.css";
import { ImageData } from "@/interface/content.dto";
import { useImageUrl } from "@/utils/use_image_url";

interface CustomPopupProps {
  imageData: ImageData;
  title: string;
  body: string;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({
  imageData,
  title,
  body,
}) => {
  const url = useImageUrl(imageData);

  return (
    <Popup className="custom-popup">
      <div className="h-[100px] flex flex-row min-w-[300px] max-w-[600px] gap-x-2">
        {url && (
          <Image
            width={100}
            height={100}
            src={url}
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
