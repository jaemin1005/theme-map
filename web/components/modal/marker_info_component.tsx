import { useMap } from "@/context/map_context";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import Image from "next/image";

interface MarkerInfoComponent {
  url: string;
  title: string;
  body: string;
  onPressCb: () => void;
  onClickEdit: React.MouseEventHandler;
  onClickDelete: React.MouseEventHandler;
}

export const MarkerInfoComponent: React.FC<MarkerInfoComponent> = ({
  url,
  title,
  body,
  onPressCb,
  onClickEdit,
  onClickDelete,
}) => {

  const { isEdited } = useMap();

  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none relative w-full h-min"
      isPressable
      isHoverable
      onPress={() => {onPressCb()}}
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
      {isEdited && (
        <div className="absolute top-0 right-0 flex z-50">
          <IconButton onClick={onClickEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onClickDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      )}
    </Card>
  );
};
