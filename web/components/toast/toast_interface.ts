import { Dispatch, SetStateAction } from "react"

export type AlertType = "success" | "info" | "warning" | "error",

export interface ToastProps {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: AlertType
    time: number
    msg: string,
}

