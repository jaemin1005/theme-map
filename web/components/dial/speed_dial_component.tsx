import {
  SpeedDial as MUISpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { MouseEventHandler } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { useAuth } from "@/context/auth_context";

interface SpeedDialProps {
  onLoginClick: MouseEventHandler;
  onRegisterClick: MouseEventHandler;
  onProfileClick: MouseEventHandler;
  onLogoutClick: MouseEventHandler;
}

enum TOOLTIP_TITLE {
  LOGIN = "Login",
  LOGOUT = "Logout",
  REGISTER = "Sign in"
}

export const SpeedDial: React.FC<SpeedDialProps> = ({ onLoginClick, onRegisterClick, onProfileClick, onLogoutClick }) => {
  const { user } = useAuth();

  return (
    <MUISpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "absolute", bottom: 16, left: 16 }}
      icon={<SpeedDialIcon />}
    >
      {user === null ? <SpeedDialAction
        icon={<PersonIcon />}
        tooltipTitle={TOOLTIP_TITLE.LOGIN}
        onClick={onLoginClick}
      /> : <SpeedDialAction icon ={<PersonIcon color="success"/>} tooltipTitle={user.name} onClick={onProfileClick}/>}
      {user === null && <SpeedDialAction icon={<PersonAddIcon/>} tooltipTitle={TOOLTIP_TITLE.REGISTER} onClick={onRegisterClick}/>}
      {user && <SpeedDialAction icon={<DirectionsRunIcon/>} tooltipTitle={TOOLTIP_TITLE.LOGOUT} onClick={onLogoutClick}/>}
    </MUISpeedDial>
  );
};
