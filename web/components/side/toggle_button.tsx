import MUIToggleButton from "@mui/material/ToggleButton";

interface ToggleButtonProps {
  children: React.ReactNode;
  selected: boolean;
  onChange: () => void;
  originIconColor: string;
  changeIconColor: string;
  className?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  selected,
  onChange,
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
      }}
      value="check"
      selected={selected}
      onChange={onChange}
      className={`group bg-gray-800 bg-opacity-60 hover:bg-opacity-100 hover:bg-gray-800 rounded-full p-2 ${className}`}
    >
      {children}
    </MUIToggleButton>
  );
};
