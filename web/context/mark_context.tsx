"use client";

import { createContext, useState, ReactNode, useContext } from "react";

// 각 마크의 상세정보를 담기위한 인터페이스
export interface Mark {
  files: File[];
  title: string;
  body: string;
  point: [number, number];
}

// context의 타입
interface MarkInfo {
  marks: Mark[];
  addMark: (mark: Mark) => void;
}

const MarkContext = createContext<MarkInfo | null>(null);

export const MarkProvider = ({ children }: { children: ReactNode }) => {
  const [marks, setMarks] = useState<Mark[]>([]);

  const addMark = (mark: Mark) => {
    setMarks((prev) => [...prev, mark]);
  };

  return (
    <MarkContext.Provider value={{ marks, addMark }}>
      {children}
    </MarkContext.Provider>
  );
};

// constext에 대한 커스텀 훅 정의
export const useMark = () => {
  try {
    const context = useContext(MarkContext);
    if (context === null) {
      console.error("useMarkInfo must be used within an MarkProvider");
      throw Error;
    }

    return context;
  } catch (err) {
    //! Provider의 외에서 사용할 경우 에러
    console.error("useMarkInfo must be used within an MarkProvider");
    throw Error;
  }
};
