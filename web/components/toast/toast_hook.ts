import { useState, Dispatch, SetStateAction } from "react";
import { AlertType } from "./toast_interface";

// 토스트 메세지 시간
interface UseToastProps {
  defaultType?: AlertType;   
  defaultTime?: number;
}

interface UseToastReturn {
  open: boolean;
  msg: string;
  time: number;
  type: AlertType;
  setOpen: Dispatch<SetStateAction<boolean>>;

  /**
   * 토스트 메세지를 화면에 보여주기 위한 메소드
   * @param message : 토스트 메세지
   * @param type : MUI Alert Type
   * @param duration : 토스트 시간
   * @returns 
   */
  showToast: (message: string, type: AlertType, duration?: number) => void;
}

/**
 * 토스트 메세시에 대한 커스텀 훅,
 * @param param0
 * @returns
 */
export const useToast = ({
  defaultType = "success",
  defaultTime = 3000,
}: UseToastProps = {}): UseToastReturn => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [time, setTime] = useState(defaultTime);
  const [type, setType] = useState<AlertType>(defaultType);

  const showToast = (message: string, type: AlertType, duration?: number) => {
    setMsg(message);
    setTime(duration || defaultTime);
    setType(type);
    setOpen(true);
  };

  return {
    open,
    msg,
    time,
    type,
    setOpen,
    showToast,
  };
};
