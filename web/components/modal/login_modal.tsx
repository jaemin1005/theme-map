"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import {
  IconButton,
  InputAdornment,
  OutlinedInput,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useRef, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Button } from "@nextui-org/button";

interface LoginModalProps {
  title: string;
  forgetPasswordMsg: string;
  handleForgetPassword: () => void
  loginMsg: string;
  handleLogin: () => void
  open: boolean;
  onOpenChange: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  title,
  forgetPasswordMsg,
  handleForgetPassword,
  loginMsg,
  handleLogin,
  onOpenChange,
}) => {
  const emaillRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // 패스워드를 보여주는 유무
  const [showPassword, setShowPassword] = useState(false);

  // 버튼 동작에 따른 handler
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // moseDown, up은 이벤트를 막는다.
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div>
      <Modal
        backdrop="opaque"
        isOpen={open}
        placement="center"
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        //scrollBehavior={"outside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1>{title}</h1>
              </ModalHeader>
              <ModalBody>
                <FormControl variant="outlined" className="w-full m-1">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Email
                  </InputLabel>
                  <OutlinedInput
                    id="standard-basic"
                    inputRef={emaillRef}
                    label="Email"
                    type="email"
                  />
                </FormControl>
                <FormControl variant="outlined" className="w-full m-1">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    inputRef={passwordRef}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <button className="w-min ml-2">
                  <span className="whitespace-nowrap text-blue-500">{forgetPasswordMsg}</span>
                </button>
                <Button radius="full" className="font-extrabold mt-5">
                    {loginMsg}
                </Button>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
