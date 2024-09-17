"use client";

import { ERROR_MSG } from "@/static/error_msg";
import { INIT_LOCATION_INFO } from "@/static/location";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import SideButtonComponent from "@/components/side_button_component";
import { WriteModal } from "@/components/modal/write_modal";
import { useMark } from "@/context/mark_context";
import { SpeedDial } from "@/components/speed_dial_component";
import PersonIcon from '@mui/icons-material/Person';

// 클라이언트에서만 랜더링 되도록 설정한다.
const MapComponent = dynamic(() => import("../components/map_component"), {
  ssr: false,
});
const MarkerComponent = dynamic(() => import("../components/marker_component"), {
  ssr: false,
});

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>(
    INIT_LOCATION_INFO.COORDINATE
  );
  const mapRef = useRef<L.Map | null>(null);
  const [clickPosition, setClickPosition] = useState<[number, number] | null>(
    null
  );

  const [mark, setMark] = useState<boolean>(false);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false); // 모달 상태 관리


  const { marks, addMark } = useMark();

  useEffect(() => {
    // 현 위치 좌표가져오기
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error(ERROR_MSG.GEOLOCATION_GETTING_FAIL, error);
        }
      );
    } else {
      console.log(ERROR_MSG.GEOLOCATION_NOT_AVAILABLE);
    }
  }, []);

  const onMapClick = (event: L.LeafletMouseEvent) => {
    if (mark) {
      setClickPosition([event.latlng.lat, event.latlng.lng]);
      setIsWriteModalOpen(true)
    }
  };

  const cbSaveBtn = (files: File[], title: string, body: string) => {

    if(clickPosition === null) return;

    addMark({
      files,
      title,
      body,
      point: clickPosition,
    });
  };

  return (
    <div className="w-screen h-screen relative">
      <MapComponent
        center={currentLocation}
        zoom={INIT_LOCATION_INFO.ZOOM}
        onMapReady={(map) => {
          mapRef.current = map;
        }}
        onMapClick={onMapClick}
      >
        <MarkerComponent></MarkerComponent>
      </MapComponent>
      <SideButtonComponent
        mapRef={mapRef}
        toggleMark={[
          mark,
          () => {
            setMark((prev) => !prev);
          },
        ]}
      />
      <WriteModal
        open={isWriteModalOpen}
        onOpenChange={() => {setIsWriteModalOpen((prev) => !prev)}}
        cbSaveBtn={cbSaveBtn}
      />
      <SpeedDial actions={[
        {key: "login", icon: <PersonIcon/>, tooltipTitle: "login", onClick: () => {}}
      ]}></SpeedDial>
    </div>
  );
}
