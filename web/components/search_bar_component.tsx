import { KeyboardEvent, useRef } from "react";
import { SEARCH_TYPE } from "@/interface/search.dto";

export const SearchBarComponent: React.FC<{
  onSearchCb: (title: SEARCH_TYPE, body: string) => void;
}> = ({ onSearchCb }) => {

  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectRef = useRef<HTMLSelectElement | null>(null);

  const searchEvent = () => {
    if (!inputRef.current || !selectRef.current) return;

    // 선택된 값을 SEARCH_TYPE로 캐스팅하여 전달
    onSearchCb(selectRef.current.value as SEARCH_TYPE, inputRef.current.value);
  };

  // Enter 키 입력 시 검색
  const keydownEv = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchEvent();
    }
  };

  return (
    <>
      <div className="w-full flex flex-nowrap items-center bg-white overflow-hidden px-2 py-1 justify-between mx-auto shadow-gray-200 shadow-lg rounded-lg h-min">
        <input
          ref={inputRef}
          className="text-base text-gray-500 flex-grow outline-none px-2 w-72"
          type="text"
          placeholder="Search your domain name"
          onKeyDown={keydownEv}
        />
        <div className="flex flex-nowrap items-center px-2 rounded-lg space-x-4 mx-auto">
          <select
            ref={selectRef}
            title="list"
            defaultValue={SEARCH_TYPE.TITLE}
            className="text-base text-gray-800 outline-none border-2 px-4 py-2 rounded-lg"
          >
            <option value={SEARCH_TYPE.TITLE}>{SEARCH_TYPE.TITLE}</option>
            <option value={SEARCH_TYPE.USER}>{SEARCH_TYPE.USER}</option>
          </select>
        </div>
      </div>
    </>
  );
};
