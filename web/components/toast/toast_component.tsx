import { Alert } from "@mui/material";
import { ToastProps } from "./toast_interface";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";

export const ToastComponent: React.FC<ToastProps> = ({
  open,
  setOpen,
  type,
  time,
  msg,
}) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={time} onClose={handleClose}>
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
