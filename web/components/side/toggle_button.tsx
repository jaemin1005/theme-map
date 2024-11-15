import MUIToggleButton from "@mui/material/ToggleButton";

interface ToggleButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onChange?: () => void;
  onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>, value: unknown) => void
  originIconColor: string;
  changeIconColor: string;
  className?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  selected,
  onChange,
  onClick,
  originIconColor,
  changeIconColor,
  className,
}) => {
  return (
    <MUIToggleButton
      sx={{
        "&.Mui-selected": {
          background: "rgb(31, 41, 55, 0.6)",
        },
        "& .MuiSvgIcon-root": {
          color: selected ? changeIconColor : originIconColor,
        },
        "&.Mui-selected:hover": {
          background: "#1f2937",
        },
        backgroundColor: "rgba(31, 41, 55, 0.6)",
        borderRadius: "9999px",
        padding: "0.5rem",
        "&:hover": {
          backgroundColor: "#1f2937",
          backgroundOpacity: 1,
        },
      }}
      value="check"
      selected={selected}
      onChange={onChange}
      onClick={onClick}
      className={`${className}`}
    >
      {children}
    </MUIToggleButton>
  );
};
