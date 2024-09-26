import { fileToUrl } from "@/Func/file_to_url";
import Image from "next/image";

interface MarkerInfoComponent {
  file: File;
  title: string;
  body: string;
}

export const MarkerInfoComponent: React.FC<MarkerInfoComponent> = ({file, title, body}) => {
  return (
    <div className="h-[130px] w-full flex flex-row gap-x-2 p-2 shadow-lg">
      {file && (
        <Image
          width={120}
          height={120}
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
  );
};
