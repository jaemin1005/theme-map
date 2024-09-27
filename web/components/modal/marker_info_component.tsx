import { fileToUrl } from "@/Func/file_to_url";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import Image from "next/image";

interface MarkerInfoComponent {
  file: File;
  title: string;
  body: string;
  onClickEdit: React.MouseEventHandler;
  onClickDelete: React.MouseEventHandler;
}

export const MarkerInfoComponent: React.FC<MarkerInfoComponent> = ({
  file,
  title,
  body,
  onClickEdit,
  onClickDelete,
}) => {
  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none relative w-full h-min"
    >
      {file ? (
        <>
          <div className="w-full aspect-video overscroll-none">
            <Image
              alt="Image"
              fill={true}
              className="object-cover aspect-square w-full h-full"
              src={fileToUrl(file)}
            />
          </div>
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
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
      <div className="absolute top-0 right-0 flex z-50">
        <IconButton onClick={onClickEdit}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={onClickDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    </Card>
  );
};
