"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// MapComponentProps
interface MapComponentProps {
  // 중심좌표
  center: [number, number];
  // 줌레벨
  zoom: number;
}

// 맵 컴포넌트
const MapComponent: React.FC<MapComponentProps> = ({ center, zoom }) => {
  const mapRef = useRef<L.Map | null>(null);
  // const [currentCenter, setCurrentCenter] = useState<[number, number]>(center);

  useEffect(() => {
    // 지도 초기화
    mapRef.current = L.map("map", {
      center: center,
      zoom: zoom,
      zoomControl: false,
      // 드래그 기능 On
      dragging: true,
      // 관성 스크롤 활성화하여 사용자 경험을 극대화한다.
      inertia: true,
    });

    // OpenStreetMap 타일 레이어 추가
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [center, zoom]);

  return (
    <>
      <div id="map" className="w-full h-full z-0"/>
    </>
  );
};

export default MapComponent;
