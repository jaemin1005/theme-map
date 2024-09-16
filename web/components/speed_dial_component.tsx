import {
    Box,
    SpeedDial as MUISpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
  } from "@mui/material";
  import { MouseEventHandler } from "react";
  
  interface SpeedDialProps {
    key: string;
    icon: React.ReactNode;
    tooltipTitle: string; // tooltipTile에서 tooltipTitle로 수정
    onClick: MouseEventHandler;
  }
  
  interface Props {
    actions: SpeedDialProps[]; // props는 SpeedDialProps의 배열이어야 합니다.
  }
  
  export const SpeedDial: React.FC<Props> = ({ actions }) => {
    return (
      <MUISpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, left: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.key}
            icon={action.icon}
            tooltipTitle={action.tooltipTitle} // tooltipTitle 사용
            onClick={action.onClick}
          />
        ))}
      </MUISpeedDial>
    );
  };
  