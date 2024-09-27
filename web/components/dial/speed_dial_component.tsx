import {
  SpeedDial as MUISpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { MouseEventHandler, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import { useAuth } from "@/context/auth_context";
import SaveIcon from "@mui/icons-material/Save";

interface SpeedDialProps {
  onLoginClick: MouseEventHandler;
  onRegisterClick: MouseEventHandler;
  onProfileClick: MouseEventHandler;
  onLogoutClick: MouseEventHandler;
  onSaveClick: MouseEventHandler;
}

enum TOOLTIP_TITLE {
  LOGIN = "Login",
  LOGOUT = "Logout",
  REGISTER = "Sign in",
  SAVE = "Save",
}

export const SpeedDial: React.FC<SpeedDialProps> = ({
  onLoginClick,
  onRegisterClick,
  onProfileClick,
  onLogoutClick,
  onSaveClick,
}) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <MUISpeedDial
      ariaLabel="SpeedDial 기본 예시"
      sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 1000 }}
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
    >
      {user === null
        ? [
            <SpeedDialAction
              key="login"
              icon={<PersonIcon />}
              tooltipTitle={TOOLTIP_TITLE.LOGIN}
              onClick={onLoginClick}
              open={open}
            />,
            <SpeedDialAction
              key="register"
              icon={<PersonAddIcon />}
              tooltipTitle={TOOLTIP_TITLE.REGISTER}
              onClick={onRegisterClick}
              open={open}
            />,
          ]
        : [
            <SpeedDialAction
              key="profile"
              icon={<PersonIcon color="success" />}
              tooltipTitle={user.name}
              onClick={onProfileClick}
              open={open}
            />,
            <SpeedDialAction
              key="logout"
              icon={<DirectionsRunIcon />}
              tooltipTitle={TOOLTIP_TITLE.LOGOUT}
              onClick={onLogoutClick}
              open={open}
            />,
            <SpeedDialAction
              key="save"
              icon={<SaveIcon />}
              tooltipTitle={TOOLTIP_TITLE.SAVE}
              onClick={onSaveClick}
              open={open}
            />,
          ]}
    </MUISpeedDial>
  );
};