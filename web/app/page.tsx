"use client";

import { ERROR_MSG } from "@/static/error_msg";
import { INIT_LOCATION_INFO } from "@/static/location";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import SideButtonComponent from "@/components/side_button_component";

// 클라이언트에서만 랜더링 되도록 설정한다.
const MapComponent = dynamic(() => import("../components/map_component"), {
  ssr: false,
});

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState<[number, number]>(
    INIT_LOCATION_INFO.COORDINATE
  );

  const mapRef = useRef<L.Map | null>(null);

  //const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 현 위치 좌표가져오기
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          //setIsLoading(false);
        },
        (error) => {
          console.error(ERROR_MSG.GEOLOCATION_GETTING_FAIL, error);
          //setIsLoading(false);
        }
      );
    } else {
      console.log(ERROR_MSG.GEOLOCATION_NOT_AVAILABLE);
      //setIsLoading(false);
    }
  }, []);

  return (
    <div className="w-screen h-screen relative">
      <MapComponent
        center={currentLocation}
        zoom={INIT_LOCATION_INFO.ZOOM}
        mapRef={mapRef}
      ></MapComponent>
      <SideButtonComponent mapRef={mapRef} />
    </div>
  );
}
