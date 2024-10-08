import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Chip, IconButton } from "@mui/material";
import { Card, CardBody, CardFooter } from "@nextui-org/card";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface MapsInfoComponentProps {
  title: string;
  body: string;
  isEdited: boolean;
  onClickEdit: React.MouseEventHandler;
  onClickDelete: React.MouseEventHandler;
}

export const MapInfoComponent: React.FC<MapsInfoComponentProps> = ({
  title,
  body,
  isEdited,
  onClickEdit,
  onClickDelete,
}) => {

  return (
    <Card
      isFooterBlurred
      radius="lg"
      className="border-none relative w-full h-min"
    >
      <CardBody className="pt-7">
        <h1 className="font-extrabold whitespace-nowrap overflow-x-hidden">
          {title}
        </h1>
        <p className="line-clamp-2 overflow-hidden">{body}</p>
      </CardBody>
      <CardFooter>
        <Chip icon={<FavoriteIcon />} label="+9999" />
      </CardFooter>
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
