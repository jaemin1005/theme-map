"use client";

import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
} from "react";

// 각 마크의 상세정보를 담기위한 인터페이스
export interface Mark {
  files: File[];
  title: string;
  body: string;
  point: [number, number];
}

// context의 타입
interface MapInfo {
  // Map Info
  id: string;
  userId: string;
  title: string;
  body: string;
  setId: (id: string) => void;
  setUserId: (userId: string) => void;
  setTitle: (title: string) => void;
  setBody: (body: string) => void;

  // Mark Info
  marks: Mark[];
  addMark: (mark: Mark) => void;
  delMark: (idx: number) => void;
}

const MapContext = createContext<MapInfo | null>(null);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

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

  return (
    <MapContext.Provider
      value={{
        id,
        userId,
        title,
        body,
        setId,
        setUserId,
        setTitle,
        setBody,
        marks,
        addMark,
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
