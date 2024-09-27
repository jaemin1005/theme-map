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
  const { marks, delMark } = useMap();

  const onClickDeleteCb = (idx: number) => {
    delMark(idx);
  };

  // TODO Edit 버튼의 처리가 필요 :)
  const onClickEditCb = () => {};

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
      scrollBehavior={"inside"}
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
                  file={mark.files[0]}
                  title={mark.title}
                  body={mark.body}
                  onClickEdit={() => {
                    onClickEditCb;
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
  );
};
