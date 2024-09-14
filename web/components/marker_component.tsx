import { useMark } from "@/context/mark_context";
import { Marker } from "react-leaflet";
import { CustomPopup } from "./custom_popup";

const MarkerComponent: React.FC = () => {
  const { marks } = useMark();

  return (
    <>
      {marks.map((value, idx) => (
        <Marker key={idx} position={value.point}>
          <CustomPopup title={value.title} body={value.body}></CustomPopup>
        </Marker>
      ))}
    </>
  );
};

export default MarkerComponent