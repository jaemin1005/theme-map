import React, { RefObject } from "react";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface CustomInputProps {
  label: string;
  type: string;
  inputRef: RefObject<HTMLInputElement>;
  showPassword?: boolean;
  handleClickShowPassword?: () => void;
  handleMouseDownPassword?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleMouseUpPassword?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type,
  inputRef,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  handleMouseUpPassword,
}) => (
  <FormControl variant="outlined" className="w-full m-1">
    <InputLabel htmlFor={`outlined-adornment-${label}`}>{label}</InputLabel>
    <OutlinedInput
      id={`outlined-adornment-${label}`}
      type={type === "password" && showPassword !== undefined ? (showPassword ? "text" : "password") : type}
      inputRef={inputRef}
      endAdornment={
        type === "password" && showPassword !== undefined ? (
          <InputAdornment position="end">
            <IconButton
              aria-label={`toggle ${label.toLowerCase()} visibility`}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ) : null
      }
      label={label}
    />
  </FormControl>
);