import { Alert } from "@mui/material";
import { ToastProps } from "./toast_interface";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

/**
 * 토스트메세지 컴포넌트
 * @param param0 
 * @returns 
 */
export const ToastComponent: React.FC<ToastProps> = ({
  open,
  setOpen,
  type,
  time,
  msg,
}) => {

  /**
   * 
   * @param _ 사영 x
   * @param reason : Snackbar의 이벤트
   * @returns 
   */
  const handleClose = (
    _?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    // 다른 곳을 클릭하여 해당 컴포넌트가 닫히지 않는다.
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={time}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {msg}
      </Alert>
    </Snackbar>
  );
};
