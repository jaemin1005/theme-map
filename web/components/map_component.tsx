import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

interface MapComponentProps {
  center: L.LatLngExpression;
  zoom: number;
  onMapReady: (mapInstance: L.Map) => void; // 맵 인스턴스를 부모에게 전달하는 콜백
}

const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  onMapReady,
}) => {
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
      <MapEventsHandler onMapReady={onMapReady} />
    </MapContainer>
  );
};

// 맵 이벤트를 처리하고 부모에게 맵 인스턴스를 전달하는 컴포넌트
const MapEventsHandler: React.FC<{
  onMapReady: (mapInstance: L.Map) => void;
}> = ({ onMapReady }) => {
  const map = useMap(); // useMap을 사용하여 맵 인스턴스를 가져옴
  
  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
};

export default MapComponent;
