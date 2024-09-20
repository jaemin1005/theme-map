import { Dispatch, SetStateAction } from "react"

// MUI Alert에 대한 Type 정의
export type AlertType = "success" | "info" | "warning" | "error";

export interface ToastProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: AlertType
    time: number
    msg: string,
}

