"use client";

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
  isNew: boolean,
  isEdited: boolean,

  setIsNew: (isNew: boolean) => void,
  setIsEdited: (isEdited: boolean) => void,

  // Mark Info
  marks: Mark[];
  addMark: (mark: Mark) => void;
  setMarks: (marks: Mark[]) => void;
  delMark: (idx: number) => void;
}

const MapContext = createContext<MapInfo | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<ObjectId>();
  const [userId, setUserId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const [isNew, setIsNew] = useState<boolean>(true);
  const [isEdited, setIsEdited] = useState<boolean>(false);

  const [marks, setMarks] = useState<Mark[]>([]);

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

  return (
    <MapContext.Provider
      value={{
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
        setMarks: setMarksFunc,
        delMark,
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
