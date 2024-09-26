import { useMark } from "@/context/mark_context";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { MarkerInfoComponent } from "./marker_info_component";

interface MarkerInfoModalProps {
  open: boolean;
  onOpenChange: () => void;
}

export const MarkerInfoModal: React.FC<MarkerInfoModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { marks } = useMark();

  if(marks.length === 0)
    return;


  return (
    <Modal
      backdrop="opaque"
      isOpen={open}
      size="xl"
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
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              {marks.map((mark, idx) => (
                <MarkerInfoComponent
                  key={idx}
                  file={mark.files[0]}
                  title={mark.title}
                  body={mark.body}
                />
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
