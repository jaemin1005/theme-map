import { useMap } from "@/context/map_context";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { MarkerInfoComponent } from "./marker_info_component";
import { WriteModal } from "./write_modal";
import { useState } from "react";
import { Mark } from "@/interface/content.dto";
import { useToast } from "../toast/toast_hook";
import { ToastComponent } from "../toast/toast_component";
import { useAuth } from "@/context/auth_context";
import { ErrMsg } from "@/interface/err.dto";
import { UploadImageRes } from "@/interface/upload.dto";
import { ERROR_MSG } from "@/static/log/error_msg";
import { API_ROUTE } from "@/static/routes";

enum MODAL_CONSTANT {
  TITLE = "Marker Info",
  CLOSE = "Close",
}

interface MarkerInfoModalProps {
  open: boolean;
  onOpenChange: () => void;
}

export const MarkerInfoModal: React.FC<MarkerInfoModalProps> = ({
  open,
  onOpenChange,
}) => {

  const { accessToken } = useAuth();

  const { marks, delMark } = useMap();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [clickMark, setClickMark] = useState<Mark>();

  const [clickIdx, setClickIdx] = useState<number>();

  const {
    open: openToast,
    type,
    msg,
    time,
    setOpen: setOpenToast,
    showToast,
  } = useToast();

  let { updateMark } = useMap();

  const onClickDeleteCb = (idx: number) => {
    delMark(idx);
  };

  // TODO Edit 버튼의 처리가 필요 :)
  const onClickEditCb = (index: number) => {
    setClickIdx(index);
    setClickMark(marks[index]);
    setModalOpen(true);
  };

  /**
   * 마커 데이터 업데이트
   * Write Modal의 Save Button 클릭시 콜백함수로 들어감
   * @param imageDatas
   * @param title
   * @param body
   * @returns
   */
  const updateMarkCb = async (
    imageDatas: Array<File | string>,
    title: string,
    body: string
  ) => {
    // 클릭된 마커가 없으면 잘못된 접근
    if (clickMark === undefined || clickIdx === undefined) return;

    clickMark.title = title;
    clickMark.body = body;

    const formData = new FormData();
    const fileIndices: number[] = [];

    imageDatas.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`file${index}`, image);
        fileIndices.push(index);
      }
    });

    if (fileIndices.length === 0) {
      updateMark(clickMark, clickIdx);
      return;
    }

    try {
      const response = await fetch(API_ROUTE.UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ErrMsg;
        showToast(errorData.message, "error");
        return;
      }

      const { img_urls: urls } = (await response.json()) as UploadImageRes;

      fileIndices.forEach((index) => {
        if (urls.length) {
          imageDatas[index] = urls.shift()!;
        }
      });

      clickMark.urls = imageDatas as string[]
      updateMark(clickMark, clickIdx);
      
    } catch {
      showToast(ERROR_MSG.INTERNAL_SERVER_ERROR, "error");
    }
  };

  return (
    <>
      <Modal
        backdrop="opaque"
        isOpen={open}
        placement="center"
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
        scrollBehavior={"inside"}
        isDismissable={!modalOpen}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1>{MODAL_CONSTANT.TITLE}</h1>
              </ModalHeader>
              <ModalBody>
                {marks.map((mark, idx) => (
                  <MarkerInfoComponent
                    key={idx}
                    url={mark.urls[0]}
                    title={mark.title}
                    body={mark.body}
                    onClickEdit={() => {
                      onClickEditCb(idx);
                    }}
                    onClickDelete={() => {
                      onClickDeleteCb(idx);
                    }}
                  />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {MODAL_CONSTANT.CLOSE}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <WriteModal
        open={modalOpen}
        onOpenChange={() => {
          setModalOpen((prev) => !prev);
        }}
        cbSaveBtn={updateMarkCb}
        mark={clickMark}
      />
      <ToastComponent
        open={openToast}
        setOpen={setOpenToast}
        type={type}
        time={time}
        msg={msg}
      />
    </>
  );
};
