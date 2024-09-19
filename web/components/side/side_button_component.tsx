"use client";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "./icon_button";
import RemoveIcon from "@mui/icons-material/Remove";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import CommentIcon from "@mui/icons-material/Comment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import L from "leaflet";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { ToggleButton } from "./toggle_button";

interface SideButtonComponentProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  toggleMark: [boolean, () => void];
}

const SideButtonComponent: React.FC<SideButtonComponentProps> = ({
  mapRef,
  toggleMark,
}) => {
  const zoomInFunc = () => {
    mapRef.current?.zoomIn();
  };

  const zoomOutFunc = () => {
    mapRef.current?.zoomOut();
  };

  const moveToCurrent = () => {
    mapRef.current?.locate({
      setView: true,
      maxZoom: mapRef.current?.getZoom(),
    });
  };

  return (
    <div className="absolute h-full flex flex-row-reverse right-0 pt-5 top-0 z-50">
      <div className="h-full flex flex-col pt-5 items-center px-2 gap-y-2">
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
        <ToggleButton selected={toggleMark[0]} onChange={toggleMark[1]} originIconColor="white" changeIconColor="#93c5fd"> 
          <BookmarkIcon className="text-white text-2xl group-hover:text-blue-300" />
        </ToggleButton>
      </div>
      {/* <div className="w-fit h-fit pt-5">
        <SearchBar/>
      </div> */}
    </div>
  );
};

export default SideButtonComponent;
