import * as React from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import { MenuBlock } from "@/atoms/menu_block";

export const IconMenu: React.FC = () => {
  return (
    <Paper sx={{ width: 320, maxWidth: "100%" }}>
      <MenuList>
        <MenuBlock mainText={"Cut"} keyCode={"⌘X"}>
          <ContentCut fontSize="small" />
        </MenuBlock>
        <MenuBlock mainText="Copy" keyCode="⌘C">
          <ContentCopy fontSize="small" />
        </MenuBlock>
        <MenuBlock mainText="Paste" keyCode="⌘V">
          <ContentPaste fontSize="small" />
        </MenuBlock>
        <Divider />
        <MenuBlock mainText="Web Clipboard">
          <Cloud fontSize="small" />
        </MenuBlock>
      </MenuList>
    </Paper>
  );
};
