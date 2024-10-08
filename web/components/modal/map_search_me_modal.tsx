import { MapSearchMeRes } from "@/interface/content.dto";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useCallback, useEffect, useState } from "react";
import { MapInfoComponent } from "./map_info_component";
import { ObjectId } from "@/interface/objectId";

enum MODAL_CONSTANT {
  TITLE = "MAP ME",
  CANCEL = "Close",
  SAVE = "Save",
}

interface MapSaerchMeModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  accessToken: string | null;
  onClickComponentCb: (_id: ObjectId) => Promise<boolean>;
}

export const MapSearchMeModal: React.FC<MapSaerchMeModalProps> = ({
  isOpen,
  onOpenChange,
  accessToken,
  onClickComponentCb,
}) => {
  const [mapsData, setMapsData] = useState<MapSearchMeRes[]>([]);

  const fetchMapsData = useCallback(async () => {
    if (accessToken === null) return;

    try {
      const response = await fetch("/api/contents/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = (await response.json()) as MapSearchMeRes[];
        setMapsData(data);
      } else {
        setMapsData([]);
      }
    } catch (error) {
      console.error("Failed to fetch maps data", error);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isOpen) {
      fetchMapsData();
    }
  }, [isOpen, fetchMapsData]);

  const onClickCb = async (idx: number) => {
    const { _id } = mapsData[idx];
    if (await onClickComponentCb(_id)) {
      onOpenChange();
    };
  };

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
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
              {mapsData.map((map, idx) => (
                <div key={idx} onClick={() => {onClickCb(idx)}}>
                  <MapInfoComponent
                    title={map.title}
                    body={map.body}
                    isEdited={map.is_edit}
                    onClickEdit={() => {}}
                    onClickDelete={() => {}}
                  />
                </div>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>{MODAL_CONSTANT.CANCEL}</Button>
              <Button>{MODAL_CONSTANT.SAVE}</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
