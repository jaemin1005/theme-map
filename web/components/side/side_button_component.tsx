"use client";

import AddIcon from "@mui/icons-material/Add";
import IconButton from "./icon_button";
import RemoveIcon from "@mui/icons-material/Remove";
import ControlCameraIcon from "@mui/icons-material/ControlCamera";
import MapIcon from "@mui/icons-material/Map";
import FavoriteIcon from "@mui/icons-material/Favorite";
import L from "leaflet";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import RoomIcon from "@mui/icons-material/Room";
import { ToggleButton } from "./toggle_button";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchIcon from "@mui/icons-material/Search";
import { useMap } from "@/context/map_context";
import { useAuth } from "@/context/auth_context";
import { useEffect, useState } from "react";
import { dislikeFetch, likeFetch } from "@/utils/fetch/like_fetch";

interface SideButtonComponentProps {
  map?: L.Map;
  toggleMark: [boolean, () => void];
  clickMarkInfo: () => void;
  clickMapMe: () => void;
  clickInitMap: () => void;
  clickSearch: () => void;
}

const SideButtonComponent: React.FC<SideButtonComponentProps> = ({
  map,
  toggleMark,
  clickMarkInfo,
  clickMapMe,
  clickInitMap,
  clickSearch,
}) => {
  const { user, accessToken } = useAuth();
  const { likes, id, setLikes } = useMap();

  const [likeSelect, setLikeSelect] = useState<boolean>(false);

  const [loading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      setLikeSelect(false);
      return;
    }

    setLikeSelect(likes.some((like) => like.$oid === user.user_id.$oid));
  }, [likes, user]);

  const zoomInFunc = () => {
    map?.zoomIn();
  };

  const zoomOutFunc = () => {
    map?.zoomOut();
  };

  const moveToCurrent = () => {
    map?.locate({
      setView: true,
      maxZoom: map.getZoom(),
    });
  };

  const clickLikeBtn = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    if (!user || !id || !accessToken || loading) {
      e.preventDefault();
      return;
    }

    setIsLoading(true);
    setLikeSelect((prev) => !prev);

    const fetchAction = likeSelect ? dislikeFetch : likeFetch;

    fetchAction(id.$oid, accessToken)
      .then((value) => {
        setLikes(value);
      })
      .catch((err) => {
        console.error(`Failed to ${likeSelect ? "dislike" : "like"}:`, err);
      })
      .finally(() => {
        setIsLoading(false);
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
        <ToggleButton
          selected={likeSelect}
          onClick={clickLikeBtn}
          originIconColor="white"
          changeIconColor="#f9a8d4"
        >
          <FavoriteIcon className="text-white text-2xl group-hover:text-pink-300" />
        </ToggleButton>
        <ToggleButton
          selected={toggleMark[0]}
          onChange={toggleMark[1]}
          originIconColor="white"
          changeIconColor="#93c5fd"
        >
          <RoomIcon className="text-white text-2xl group-hover:text-blue-300" />
        </ToggleButton>
        <IconButton className="mt-5" onClick={clickSearch}>
          <SearchIcon className="text-white text-2xl group-hover:text-purple-300" />
        </IconButton>
        <IconButton onClick={clickMarkInfo}>
          <BookmarkIcon className="text-white text-2xl group-hover:text-green-300" />
        </IconButton>
        <IconButton onClick={clickMapMe}>
          <MapIcon className="text-white group-hover:text-purple-300" />
        </IconButton>
        <IconButton className="mt-5" onClick={clickInitMap}>
          <DeleteForeverIcon className="text-white text-2xl group-hover:text-gray-500" />
        </IconButton>
      </div>
      {/* <div className="w-fit h-fit pt-5">
        <SearchBar/>
      </div> */}
    </div>
  );
};

export default SideButtonComponent;
