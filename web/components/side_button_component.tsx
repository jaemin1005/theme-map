import AddIcon from "@mui/icons-material/Add";
import IconButton from "@/atoms/icon_button";
import RemoveIcon from "@mui/icons-material/Remove";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import L from "leaflet";

interface SideButtonComponentProps {
  mapRef: React.MutableRefObject<L.Map | null>;
}

const SideButtonComponent: React.FC<SideButtonComponentProps> = ({
  mapRef,
}) => {
  const zoomInFunc = () => {
    mapRef.current?.zoomIn();
  };

  const zoomOutFunc = () => {
    mapRef.current?.zoomOut();
  };

  const moveToCurrent = () => {
    mapRef.current?.locate({ setView: true, maxZoom: mapRef.current?.getZoom() });
  };

  return (
    <div className="absolute h-full flex flex-col right-0 pt-5 items-center px-2 gap-y-1 top-0 z-50">
      <IconButton onClick={zoomInFunc}>
        <AddIcon className="text-white text-2xl" />
      </IconButton>
      <IconButton onClick={zoomOutFunc}>
        <RemoveIcon className="text-white text-2xl" />
      </IconButton>
      <IconButton className="mt-5" onClick={moveToCurrent}>
        <ControlCameraIcon className="text-white text-2xl group-hover:text-yellow-300" />
      </IconButton>
      <IconButton>
        <CommentIcon className="text-white text-2xl group-hover:text-green-300" />
      </IconButton>
      <IconButton>
        <FavoriteIcon className="text-white text-2xl group-hover:text-pink-300" />
      </IconButton>
    </div>
  );
};

export default SideButtonComponent;
