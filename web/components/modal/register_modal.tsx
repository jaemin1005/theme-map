"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { CustomInput } from "./\bcustom_modal_input";
import {
  hasContainSpecialCharacters,
  isCheckMinMaxLength,
  isValidEmail,
} from "@/utils/validate";
import { useToast } from "../toast/toast_hook";
import { ToastComponent } from "../toast/toast_component";
import { TOAST_MSG } from "@/static/component/toast_msg";

enum MODAL_ERR_MSG {
  REF_ERROR = "REF_ERROR",
}

interface RegisterModalProps {
  open: boolean;
  onOpenChange: () => void;
  registerCbFunc: (email: string, nickname: string, password: string) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onOpenChange,
  registerCbFunc,
}) => {
  // 모달창의 Input Ref 정의
  const emailRef = useRef<HTMLInputElement | null>(null);
  const nicknameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);

  // 패스워드를 보여주는 유무
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);

  // SnackBar
  const toastProps = useToast({ defaultType: "warning" });

  const [errMsg, setErrMsg] = useState<string>("");

  // 버튼 동작에 따른 handler
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordCheck = () =>
    setShowPasswordCheck((show) => !show);

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

  // 회원가입 절차 진행
  const processRegister = () => {
    if (
      emailRef.current &&
      nicknameRef.current &&
      passwordRef.current &&
      passwordCheckRef.current
    ) {
      const emailValue = emailRef.current.value;
      const nicknameValue = nicknameRef.current.value;
      const passwordValue = passwordRef.current.value;
      const passwordCheckValue = passwordCheckRef.current.value;

      // 이메일 형식이 아닐 때
      if (isValidEmail(emailValue) === false) {
        setErrMsg(TOAST_MSG.INVALID_EMAIL)
        toastProps.setOpen(true);
        return;
      }

      // nickname에 특수문자가 들어갈 때
      if (hasContainSpecialCharacters(nicknameValue) === true) {
        setErrMsg(TOAST_MSG.INVALID_NICKNAME)
        toastProps.setOpen(true);
        return;
      }

      // 패드워드의 최소 최대 길이 확인
      if (isCheckMinMaxLength(passwordValue, 8, 15) === false) {
        setErrMsg(TOAST_MSG.INVALID_PASSWORD_LENGTH)
        toastProps.setOpen(true);
        return;
      }

      // 패스워드와 패스워드 확인 일치
      if (passwordValue !== passwordCheckValue) {
        setErrMsg(TOAST_MSG.INVALID_MATCH_PASSWORD)
        toastProps.setOpen(true);
        return;
      }

      registerCbFunc(emailValue, nicknameValue, passwordValue);
    } else {
      console.error(MODAL_ERR_MSG.REF_ERROR);
    }
  };

  return (
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
        <ModalHeader className="flex flex-col gap-1">
          <h1>{"Register"}</h1>
        </ModalHeader>
        <ModalBody>
          <CustomInput key={1} label="Email" type="email" inputRef={emailRef} />
          <CustomInput
            key={2}
            label="Nickname"
            type="text"
            inputRef={nicknameRef}
          />
          <CustomInput
            key={3}
            label="Password"
            type="password"
            inputRef={passwordRef}
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
            handleMouseDownPassword={handleMouseDownPassword}
            handleMouseUpPassword={handleMouseUpPassword}
          />
          <CustomInput
            key={4}
            label="Password Check"
            type="password"
            inputRef={passwordCheckRef}
            showPassword={showPasswordCheck}
            handleClickShowPassword={handleClickShowPasswordCheck}
            handleMouseDownPassword={handleMouseDownPassword}
            handleMouseUpPassword={handleMouseUpPassword}
          />
          <Button
            radius="full"
            className="font-extrabold mt-5"
            onClick={() => {
              processRegister();
            }}
          >
            {"register"}
          </Button>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
      <ToastComponent
        open={toastProps.open}
        setOpen={toastProps.setOpen}
        type={toastProps.type}
        time={toastProps.time}
        msg={errMsg}
      />
    </Modal>
  );
};
