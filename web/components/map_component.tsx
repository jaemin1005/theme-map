"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(center);

  useEffect(() => {
    // 지도 초기화
    mapRef.current = L.map("map", {
      center: center,
      zoom: zoom,
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

    // 드래그 이벤트 리스너 추가
    // 드래그 시 맵을 이동한다.
    mapRef.current.on("drag", () => {
      if (mapRef.current) {
        // 현재 중심 좌표를 가져와 설정한다.
        const newCenter = mapRef.current.getCenter();
        setCurrentCenter([newCenter.lat, newCenter.lng]);
      }
    });

    // 컴포넌트가 언마운트될 때 지도 제거
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [center, zoom]);

  return (
    <div>
      <div id="map" style={{ height: "400px", width: "100%" }} />
      <div>
        현재 중심 좌표: {currentCenter[0].toFixed(4)},{" "}
        {currentCenter[1].toFixed(4)}
      </div>
    </div>
  );
};

export default MapComponent;
