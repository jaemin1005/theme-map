import { MapSearchMeRes } from "@/interface/content.dto";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useCallback, useState } from "react";
import { MapInfoComponent } from "./map_info_component";
import { ObjectId } from "@/interface/objectId";
import { API_ROUTE } from "@/static/api/routes";
import { SearchBarComponent } from "../search_bar_component";
import { SEARCH_TYPE } from "@/interface/search.dto";

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

export const MapSearchModal: React.FC<MapSaerchMeModalProps> = ({
  isOpen,
  onOpenChange,
  accessToken,
  onClickComponentCb,
}) => {
  const [mapsData, setMapsData] = useState<MapSearchMeRes[]>([]);

  const onClickCb = async (idx: number) => {
    const { _id } = mapsData[idx];
    if (await onClickComponentCb(_id)) {
      onOpenChange();
    }
  };

  const onSearchCb = useCallback(
    async (title: SEARCH_TYPE, body: string) => {
      const queryParams = new URLSearchParams({
        search_type: title,
        body: encodeURIComponent(body),
      }).toString();
      const url = `${API_ROUTE.MAP_SEARCH}?${queryParams}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setMapsData(data);
      }
    },
    [accessToken]
  );

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
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <SearchBarComponent onSearchCb={onSearchCb} />
                {mapsData.map((map, idx) => (
                  <MapInfoComponent
                    key={idx}
                    title={map.title}
                    body={map.body}
                    isEdited={map.is_edit}
                    likes={map.likes}
                    onClickCb={() => {
                      onClickCb(idx);
                    }}
                  />
                ))}
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>{MODAL_CONSTANT.CANCEL}</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
