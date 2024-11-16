import {
  Circle,
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  startWatchingPosition,
  stopWatchingPosition,
} from "@/utils/geo/watchPosition";
import { ERROR_MSG } from "@/static/log/error_msg";

interface MapComponentProps {
  children?: React.ReactNode;
  center: L.LatLngExpression;
  zoom: number;
  onMapReady: (mapInstance: L.Map) => void; // 맵 인스턴스를 부모에게 전달하는 콜백
  onMapClick?: L.LeafletMouseEventHandlerFn;
}

const MapComponent: React.FC<MapComponentProps> = ({
  children,
  center,
  zoom,
  onMapReady,
  onMapClick,
}) => {
  const [userPosition, setUserPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const watchId = startWatchingPosition(
      (location) => setUserPosition(location),
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error(ERROR_MSG.GEOLOCATION_PERMISSION_DENIED);
            break;
          case error.POSITION_UNAVAILABLE:
            console.error(ERROR_MSG.GEOLOCATION_POSITION_UNAVAILABLE);
            break;
          case error.TIMEOUT:
            console.error(ERROR_MSG.GEOLOCATION_TIMEOUT);
            break;
          default:
            console.error(ERROR_MSG.GEOLOCATION_GETTING_FAIL);
            break;
        }
      }
    );

    return () => stopWatchingPosition(watchId);
  }, []);

  useEffect(() => {
    // 기본 마커 아이콘 설정
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }, []);

  // 자기 위치 표시
  // https://react-leaflet.js.org/docs/example-layers-control/
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      className="w-full h-full z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {children}
      <MapEventsHandler
        onMapReady={onMapReady}
        click={onMapClick}
        center={center}
        zoom={zoom}
      />
      <Circle
        center={userPosition}
        pathOptions={{ fillColor: "blue" }}
        radius={10}
      />
      <Circle
        center={userPosition}
        pathOptions={{ fillColor: "red" }}
        radius={5}
        stroke={false}
      />
    </MapContainer>
  );
};

// 맵 이벤트를 처리하고 부모에게 맵 인스턴스를 전달하는 컴포넌트
const MapEventsHandler: React.FC<{
  onMapReady: (mapInstance: L.Map) => void;
  click?: L.LeafletMouseEventHandlerFn;
  center: L.LatLngExpression;
  zoom: number;
}> = ({ onMapReady, click, center, zoom }) => {
  const map = useMapEvents({
    click,
  });

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // map.setView(center, zoom)을 호출하여 맵의 중심 좌표와 줌 레벨을 업데이트
  useEffect(() => {
    if (map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

export default MapComponent;
