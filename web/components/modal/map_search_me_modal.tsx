import { MapId, MapSearchMeRes } from "@/interface/content.dto";
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
import { API_ROUTE } from "@/static/api/routes";
import { useMap } from "@/context/map_context";
import { ToastComponent } from "../toast/toast_component";
import { useToast } from "../toast/toast_hook";
import { TOAST_MSG } from "@/static/component/toast_msg";

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

  const { init, id } = useMap();

  const { open, type, msg, time, setOpen, showToast } = useToast();

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
    }
  };

  const onClickDeleteCb = async (idx: number) => {
    const map = mapsData[idx];

    const body: MapId = {
      _id: map._id,
    };

    try {
      const res = await fetch(API_ROUTE.DELETE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        showToast(TOAST_MSG.MAP_DELETE_FAIL, "error");
        return;
      }

      const mapId = (await res.json()) as MapId;

      if (id && mapId._id.$oid === id.$oid) {
        init();
      }
      setMapsData((prev) => {
        const newMaps = [...prev];
        newMaps.splice(idx, 1);
        return newMaps;
      });
    } catch (error) {
      showToast(TOAST_MSG.INTERNAL_SERVER_ERROR, "error");
    }
  };

  return (
    <>
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
                  <MapInfoComponent
                    key={idx}
                    title={map.title}
                    body={map.body}
                    isEdited={map.is_edit}
                    onClickCb={() => {
                      onClickCb(idx);
                    }}
                    onClickDelete={(e) => {
                      e.stopPropagation();
                      onClickDeleteCb(idx);
                    }}
                  />
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
      <ToastComponent
        open={open}
        setOpen={setOpen}
        type={type}
        time={time}
        msg={msg}
      />
    </>
  );
};
