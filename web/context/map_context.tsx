"use client";
import L from "leaflet";

import { Mark } from "@/interface/content.dto";
import { ObjectId } from "@/interface/objectId";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
} from "react";

// context의 타입
interface MapInfo {
  // Leaflet
  map?: L.Map;
  setMap: (map: L.Map) => void;

  // Map Info
  id?: ObjectId;
  userId: string;
  title: string;
  body: string;

  setId: (id: ObjectId) => void;
  setUserId: (userId: string) => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;

  // Map State
  isNew: boolean;
  isEdited: boolean;

  setIsNew: (isNew: boolean) => void;
  setIsEdited: (isEdited: boolean) => void;

  // Mark Info
  marks: Mark[];
  addMark: (mark: Mark) => void;
  updateMark: (mark: Mark, idx: number) => void;
  setMarks: (marks: Mark[]) => void;
  delMark: (idx: number) => void;

  likes: ObjectId[];
  setLikes: (likes: ObjectId[]) => void;

  // Utils
  init: () => void;
}

const MapContext = createContext<MapInfo | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<L.Map>();

  const [id, setId] = useState<ObjectId>();
  const [userId, setUserId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const [isNew, setIsNew] = useState<boolean>(true);
  const [isEdited, setIsEdited] = useState<boolean>(true);

  const [marks, setMarks] = useState<Mark[]>([]);

  const [likes, setLikes] = useState<ObjectId[]>([]);

  const addMark = useCallback((mark: Mark) => {
    setMarks((prev) => [...prev, mark]);
  }, []);

  const delMark = useCallback((index: number) => {
    setMarks((prev) => {
      const newMarks = [...prev];
      newMarks.splice(index, 1);
      return newMarks;
    });
  }, []);

  const setMarksFunc = useCallback((marks: Mark[]) => {
    setMarks(marks);
  }, []);

  const updateMark = useCallback((mark: Mark, index: number) => {
    setMarks((prev) => {
      const newMarks = [...prev];
      newMarks[index] = mark;
      return newMarks;
    });
  }, []);
  const init = useCallback(() => {
    setId(undefined);
    setUserId("");
    setTitle("");
    setBody("");

    setIsEdited(true);
    setMarks([]);
    setLikes([]);
  }, []);

  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        id,
        userId,
        title,
        body,
        isNew,
        isEdited,
        setId,
        setUserId,
        setTitle,
        setBody,
        setIsNew,
        setIsEdited,
        marks,
        addMark,
        updateMark,
        setMarks: setMarksFunc,
        delMark,
        init,
        likes,
        setLikes,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

// constext에 대한 커스텀 훅 정의
export const useMap = () => {
  try {
    const context = useContext(MapContext);
    if (context === null) {
      console.error("useMap must be used within an MapProvider");
      throw Error;
    }

    return context;
  } catch (err) {
    //! Provider의 외에서 사용할 경우 에러
    console.error("useMap must be used within an MapProvider");
    throw Error;
  }
};
