import { Card, CardBody } from "@nextui-org/card";
import { Image } from "@nextui-org/image";
import { Popup } from "react-leaflet";

interface CustomPopupProps {
  title: string;
  body: string;
}

export const CustomPopup: React.FC<CustomPopupProps> = ({title, body}) => {
  return (
    <Popup>
      <Card
        isBlurred
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
      >
        <CardBody>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
            <div className="relative col-span-6 md:col-span-4">
              <Image
                alt="Album cover"
                className="object-fill"
                width={100}
                height={100}
                shadow="md"
                src="https://nextui.org/images/album-cover.png"
              />
            </div>

            <div className="flex flex-col col-span-6 md:col-span-8">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-0">
                  <h1 className="font-semibold text-foreground/90">{title}</h1>
                  <p className="text-small text-foreground/80">{body}</p>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Popup>
  );
};
