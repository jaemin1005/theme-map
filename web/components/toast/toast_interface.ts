import { Dispatch, SetStateAction } from "react"

// MUI Alert에 대한 Type 정의
export type AlertType = "success" | "info" | "warning" | "error";

/**
 * Toast Component의 Props
 * open: 모달창의 on, off
 * setOpen: 모달창의 on, off 상태를 변경해주는 함수
 * time: 모달창의 지속되는 시간
 * msg: 모달창의 메세지
 */
export interface ToastProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: AlertType
    time: number
    msg: string,
}

