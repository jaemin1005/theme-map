import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";

interface MenuBlockProps {
  children: React.ReactNode;
  mainText: string;
  keyCode?: string; // ⌘X
}

export const MenuBlock: React.FC<MenuBlockProps> = ({
  children,
  mainText,
  keyCode,
}) => {
  return (
    <MenuItem>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText>{mainText}</ListItemText>
      {keyCode && (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {keyCode}
        </Typography>
      )}
    </MenuItem>
  );
};
