import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from "@nextui-org/modal";
import { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { Button } from "@nextui-org/button";
import { useMap } from "@/context/map_context";

enum MODAL_CONSTANT {
  TITLE = "MAP SAVE",
  CANCEL = "Close",
  SAVE = "Save",
}

interface MapSaveModalProps {
  open: boolean;
  onOpenChange: () => void;
  isNew: boolean;
  clickSaveCb: (title: string, body: string) => void;
}

export const MapSaveModal: React.FC<MapSaveModalProps> = ({
  open,
  onOpenChange,
  isNew,
  clickSaveCb,
}) => {
  const { title, body } = useMap();

  const titleRef = useRef<HTMLInputElement | null>(null);
  const bodyRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!titleRef.current || !bodyRef.current) return;

    if(isNew) {
      titleRef.current.value = "";
      bodyRef.current.value = "";
    }

    else {
      titleRef.current.value = title;
      bodyRef.current.value = body;
    }

  }, [open ,isNew, title, body]);

  const clickSaveBtn = () => {
    if (titleRef.current && bodyRef.current) {
      const titleVal = titleRef.current.value;
      const bodyVal = bodyRef.current.value;

      clickSaveCb(titleVal, bodyVal);
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
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h1>{MODAL_CONSTANT.TITLE}</h1>
            </ModalHeader>
            <ModalBody>
              <TextField inputRef={titleRef} label="Title" variant="outlined" />
              <TextField inputRef={bodyRef} label="Body" multiline rows={10} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onClick={onClose}>
                {MODAL_CONSTANT.CANCEL}
              </Button>
              <Button color="primary" onClick={clickSaveBtn}>
                {MODAL_CONSTANT.SAVE}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
