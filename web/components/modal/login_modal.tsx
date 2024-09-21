"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import React, { useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { CustomInput } from "./\bcustom_modal_input";

interface RegisterMsg {
  msg?: string;
  btnMsg?: string;
}

interface LoginModalProps {
  open: boolean;
  onOpenChange: () => void;
  title: string;
  forgetPasswordMsg: string;
  handleForgetPassword: () => void;
  loginMsg: string;
  handleLogin: (id: string, password: string) => void;
  register?: RegisterMsg;
  handleRegisterClick: React.MouseEventHandler;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  title,
  forgetPasswordMsg,
  handleForgetPassword,
  loginMsg,
  handleLogin,
  onOpenChange,
  register,
  handleRegisterClick,
}) => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // 패스워드를 보여주는 유무
  const [showPassword, setShowPassword] = useState(false);

  const registerMsg = register?.msg ? register.msg : "Don't have an account?";
  const registerBtnMsg = register?.btnMsg ? register.btnMsg : "sign up";

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

  const handleEnterKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleLogin(emailRef.current!.value, passwordRef.current!.value);
    }
  };

  const handleLoginBtnClick = () => {
    handleLogin(emailRef.current!.value, passwordRef.current!.value);
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
              <ModalBody onKeyDown={handleEnterKeyDown}>
                <CustomInput label="Email" type="email" inputRef={emailRef} />
                <CustomInput
                  label="Password"
                  type="password"
                  inputRef={passwordRef}
                  showPassword={showPassword}
                  handleClickShowPassword={handleClickShowPassword}
                  handleMouseDownPassword={handleMouseDownPassword}
                  handleMouseUpPassword={handleMouseUpPassword}
                />
                <button className="whitespace-nowrap text-blue-500 ml-2 w-min">
                  {forgetPasswordMsg}
                </button>
                <Button
                  radius="full"
                  className="font-extrabold mt-5"
                  onClick={handleLoginBtnClick}
                >
                  {loginMsg}
                </Button>
                <span>
                  {registerMsg}
                  <button
                    className="whitespace-nowrap text-blue-500 ml-2"
                    onClick={handleRegisterClick}
                  >
                    {registerBtnMsg}
                  </button>
                </span>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
