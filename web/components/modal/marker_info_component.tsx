import { useMap } from "@/context/map_context";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";

interface MarkerInfoComponent {
  url: string;
  title: string;
  body: string;
  onClickCb: () => void;
  onClickMapMove: React.MouseEventHandler;
  onClickEdit: React.MouseEventHandler;
  onClickDelete: React.MouseEventHandler;
}

export const MarkerInfoComponent: React.FC<MarkerInfoComponent> = ({
  url,
  title,
  body,
  onClickCb,
  onClickMapMove,
  onClickEdit,
  onClickDelete,
}) => {
  const { map, isEdited } = useMap();

  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none relative w-full h-min"
      isPressable
      isHoverable
      onClick={() => {
        onClickCb();
      }}
    >
      {url ? (
        <>
          <div className="w-full aspect-video overscroll-none relative">
            <Image
              alt="Image"
              fill={true}
              className="object-cover aspect-square w-full h-full"
              src={url}
            />
          </div>
          <CardFooter className="black justify-between before:bg-white/10 bg-gray-500/30 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-large text-white/80">{title}</p>
          </CardFooter>
        </>
      ) : (
        <CardBody className="pt-7">
          <h1 className="font-extrabold whitespace-nowrap overflow-x-hidden">
            {title}
          </h1>
          <p className="line-clamp-2 overflow-hidden">{body}</p>
        </CardBody>
      )}
      <div className="absolute top-0 right-0 flex z-[9999]">
        <IconButton onClick={onClickMapMove} className="hover:text-blue-400">
          <ControlCameraIcon />
        </IconButton>
        {isEdited && (
          <>
            <IconButton onClick={onClickEdit} className="hover:text-blue-400">
              <EditIcon />
            </IconButton>
            <IconButton onClick={onClickDelete} className="hover:text-blue-400">
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </div>
    </Card>
  );
};
