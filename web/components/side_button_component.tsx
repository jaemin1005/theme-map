import AddIcon from "@mui/icons-material/Add";
import IconButton from "@/atoms/icon_button";
import RemoveIcon from '@mui/icons-material/Remove';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import CommentIcon from '@mui/icons-material/Comment';
import FavoriteIcon from '@mui/icons-material/Favorite';

const SideButtonComponent: React.FC = () => {
  return (
    <div className="absolute h-full flex flex-col z-50 right-0 pt-5 items-center px-2 gap-y-1">
      <IconButton>
        <AddIcon className="text-white text-2xl" />
      </IconButton>
      <IconButton>
        <RemoveIcon className="text-white text-2xl"/>
      </IconButton>
      <IconButton className="mt-5">
        <ControlCameraIcon className="text-white text-2xl group-hover:text-yellow-300"/>
      </IconButton>
      <IconButton>
        <CommentIcon className="text-white text-2xl group-hover:text-green-300"/>
      </IconButton>
      <IconButton>
        <FavoriteIcon className="text-white text-2xl group-hover:text-pink-300"/>
      </IconButton>
    </div>
  );
};

export default SideButtonComponent;
