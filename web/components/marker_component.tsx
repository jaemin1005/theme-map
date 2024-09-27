import { useMap } from "@/context/mark_context";
import { Marker } from "react-leaflet";
import { CustomPopup } from "./pop_up/custom_popup";

const MarkerComponent: React.FC = () => {
  const { marks } = useMap();

  return (
    <>
      {marks.map((value, idx) => (
        <Marker key={idx} position={value.point}>
          <CustomPopup
            file={value.files[0]}
            title={value.title}
            body={value.body}
          ></CustomPopup>
        </Marker>
      ))}
    </>
  );
};

export default MarkerComponent;
